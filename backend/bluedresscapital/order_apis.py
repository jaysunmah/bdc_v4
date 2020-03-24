from rest_framework import generics
from rest_framework.response import Response

from .serializers import OrderSerializer, OrderUpsertSerializer
from .models import Portfolio, Brokerage, Order
from backend.tdameritrade.util.helpers import upsert_orders as upsert_tda_orders
from backend.tdameritrade.models import TDAccount
from backend.tdameritrade.tdascraper import TDAClient

class OrdersAPI(generics.GenericAPIView):
    url = "bdc/orders/"
    serializer_class = OrderUpsertSerializer

    def get(self, request):
        """
        Given an input brokerage, fetches all orders related to portfolio sorted chronologically
        :param request:
        :return:
        """
        if 'brokerage' not in request.GET:
            return Response({"error": "brokerage required in url parameter"})
        brokerage = Brokerage.objects.get(name=request.GET['brokerage'])
        portfolio = Portfolio.objects.get(bdc_user=self.request.user, brokerage=brokerage)
        orders = Order.objects.filter(portfolio=portfolio).order_by('date')
        return Response(OrderSerializer(orders, many=True).data)

    def post(self, request):
        """
        Given an input brokerage, updates all orders related to the portfolio linked to brokerage + user
        :param request:
        :return: returns updated order history for portfolio
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        brokerage = Brokerage.objects.get(name=serializer.data['brokerage'])
        portfolio = Portfolio.objects.get(bdc_user=self.request.user, brokerage=brokerage)

        if brokerage.is_rh():
            return Response({"status": "TODO RH"})
        elif brokerage.is_tda():
            td_account = TDAccount.objects.get(bdc_user=self.request.user)
            return upsert_tda_orders(TDAClient(td_account), portfolio)

        return Response({"status": "TODO"})
