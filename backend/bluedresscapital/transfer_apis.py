from rest_framework import generics
from rest_framework.response import Response

from .serializers import TransferSerializer, BrokerageInputSerializer
from .models import Portfolio, Brokerage, Transfer
from backend.tdameritrade.util.helpers import upsert_transfers as upsert_tda_transfers
from backend.tdameritrade.models import TDAccount
from backend.tdameritrade.tdascraper import TDAClient
from backend.robinhood.util.helpers import upsert_transfers as upsert_rh_transfers
from backend.robinhood.models import RHAccount
from backend.robinhood.rhscraper import RHClient

class TransfersAPI(generics.GenericAPIView):
    url = "bdc/transfers/"
    serializer_class = BrokerageInputSerializer

    def get(self, request):
        """
        Given an input brokerage, fetches all transactions related to portfolio sorted chronologically
        :param request:
        :return:
        """
        if 'brokerage' in request.GET:
            brokerage = Brokerage.objects.get(name=request.GET['brokerage'])
            portfolios = Portfolio.objects.filter(bdc_user=self.request.user, brokerage=brokerage)
        else:
            portfolios = Portfolio.objects.filter(bdc_user=self.request.user)
        transfers = Transfer.objects.filter(portfolio__in=portfolios).order_by('-date')
        return Response(TransferSerializer(transfers, many=True).data)

    def post(self, request):
        """
        Given an input brokerage, updates all transactions related to the portfolio linked to brokerage + user
        :param request:
        :return: returns updated transaction history for portfolio
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        brokerage = Brokerage.objects.get(name=serializer.data['brokerage'])
        portfolio = Portfolio.objects.get(bdc_user=self.request.user, brokerage=brokerage)

        if brokerage.is_rh():
            rh_account = RHAccount.objects.get(bdc_user=self.request.user)
            return upsert_rh_transfers(RHClient(rh_account), portfolio)
        elif brokerage.is_tda():
            td_account = TDAccount.objects.get(bdc_user=self.request.user)
            return upsert_tda_transfers(TDAClient(td_account), portfolio)

        return Response({"error": "invalid brokerage type"})
