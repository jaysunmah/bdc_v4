from rest_framework import generics
from rest_framework.response import Response

from .serializers import TransferSerializer, BrokerageInputSerializer, TransferManualSaveSerializer, ManualDeleteByUidSerializer, TransferManualEditSerializer
from .models import Portfolio, Transfer, TDA_BROKERAGE, RH_BROKERAGE
from backend.tdameritrade.util.helpers import upsert_transfers as upsert_tda_transfers
from backend.tdameritrade.models import TDAccount
from backend.tdameritrade.tdascraper import TDAClient
from backend.robinhood.util.helpers import upsert_transfers as upsert_rh_transfers
from backend.robinhood.models import RHAccount
from backend.robinhood.rhscraper import RHClient

import time

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
            portfolios = Portfolio.objects.filter(bdc_user=self.request.user, brokerage=request.GET['brokerage'])
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
        portfolio = Portfolio.objects.get(bdc_user=self.request.user, brokerage=serializer.data['brokerage'])

        if serializer.data['brokerage'] == RH_BROKERAGE:
            rh_account = RHAccount.objects.get(bdc_user=self.request.user)
            return upsert_rh_transfers(RHClient(rh_account), portfolio)
        elif serializer.data['brokerage'] == TDA_BROKERAGE:
            td_account = TDAccount.objects.get(bdc_user=self.request.user)
            return upsert_tda_transfers(TDAClient(td_account), portfolio)

        return Response({"error": "invalid brokerage type"})

class SaveManualTransferAPI(generics.GenericAPIView):
    url = "bdc/transfers/manual/save/"
    serializer_class = TransferManualSaveSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        portfolio = Portfolio.objects.get(bdc_user=self.request.user, brokerage=serializer.data['brokerage'])
        t = Transfer(
            uid="manual_" + str(time.time_ns()),
            portfolio=portfolio,
            amount=serializer.data['amount'],
            is_deposit_type=serializer.data['action'] == "DEPOSIT",
            manually_added=True,
            date=serializer.data['date']
        )
        t.save()
        portfolios = Portfolio.objects.filter(bdc_user=self.request.user)
        return Response(TransferSerializer(Transfer.objects.filter(portfolio__in=portfolios).order_by('-date'), many=True).data)

class DeleteManualTransferAPI(generics.GenericAPIView):
    url = "bdc/transfers/manual/delete/"
    serializer_class = ManualDeleteByUidSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        transfer = Transfer.objects.get(uid=serializer.data['uid'])
        transfer.delete()
        portfolios = Portfolio.objects.filter(bdc_user=self.request.user)
        return Response(TransferSerializer(Transfer.objects.filter(portfolio__in=portfolios).order_by('-date'), many=True).data)

class EditManualTransferAPI(generics.GenericAPIView):
    url = "bdc/transfers/manual/edit/"
    serializer_class = TransferManualEditSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        t = Transfer.objects.get(uid=serializer.data['uid'])
        t.amount = serializer.data['amount']
        t.is_deposit_type = serializer.data['action'] == 'DEPOSIT'
        t.date = serializer.data['date']
        t.save()
        portfolios = Portfolio.objects.filter(bdc_user=self.request.user)
        return Response(TransferSerializer(Transfer.objects.filter(portfolio__in=portfolios).order_by('-date'), many=True).data)