import datetime

import pytz
from rest_framework import generics
from rest_framework.response import Response
import time

from .serializers import OrderSerializer, BrokerageInputSerializer, OrderManualSaveSerializer, \
    ManualDeleteByUidSerializer, OrderManualEditSerializer
from .models import Portfolio, Brokerage, Order, Stock
from backend.tdameritrade.util.helpers import upsert_orders as upsert_tda_orders
from backend.tdameritrade.models import TDAccount
from backend.tdameritrade.tdascraper import TDAClient
from backend.robinhood.util.helpers import upsert_orders as upsert_rh_orders
from backend.robinhood.models import RHAccount
from backend.robinhood.rhscraper import RHClient, get_stock_from_symbol

class OrdersAPI(generics.GenericAPIView):
    url = "bdc/orders/"
    serializer_class = BrokerageInputSerializer

    def get(self, request):
        """
        Given an input brokerage, fetches all orders related to portfolio sorted chronologically
        :param request:
        :return:
        """
        if 'brokerage' in request.GET:
            brokerage = Brokerage.objects.get(name=request.GET['brokerage'])
            portfolios = Portfolio.objects.filter(bdc_user=self.request.user, brokerage=brokerage)
        else:
            portfolios = Portfolio.objects.filter(bdc_user=self.request.user)
        orders = Order.objects.filter(portfolio__in=portfolios).order_by('-date')
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
            rh_account = RHAccount.objects.get(bdc_user=self.request.user)
            return upsert_rh_orders(RHClient(rh_account), portfolio)
        elif brokerage.is_tda():
            td_account = TDAccount.objects.get(bdc_user=self.request.user)
            return upsert_tda_orders(TDAClient(td_account), portfolio)

        return Response(OrderSerializer(Order.objects.filter(portfolio=portfolio).order_by('-date'), many=True).data)

class SaveManualOrderAPI(generics.GenericAPIView):
    url = "bdc/orders/manual/save/"
    serializer_class = OrderManualSaveSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ticker = serializer.data['stock']
        try:
            stock = Stock.objects.get(ticker=ticker)
        except Stock.DoesNotExist:
            try:
                stock_name = get_stock_from_symbol(ticker)
            except:
                return Response({"error": "Invalid stock ticker: " + ticker})
            stock = Stock(ticker=ticker, name=stock_name)
            stock.save()
        order = Order(
            uid="manual__" + str(time.time_ns()),
            portfolio=Portfolio.objects.get(brokerage__name=serializer.data['brokerage']),
            stock=stock,
            quantity=serializer.data['quantity'],
            value=serializer.data['price'],
            is_buy_type=serializer.data['action'] == "BUY",
            manually_added=True,
            date=datetime.datetime.strptime(serializer.data['date'], "%Y-%m-%d").replace(tzinfo=pytz.UTC)
        )
        order.save()
        orders = Order.objects.filter(portfolio__bdc_user=self.request.user).order_by('-date')
        return Response(OrderSerializer(orders, many=True).data)

class DeleteManualOrderAPI(generics.GenericAPIView):
    url = "bdc/orders/manual/delete/"
    serializer_class = ManualDeleteByUidSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = Order.objects.get(uid=serializer.data['uid'])
        order.delete()
        orders = Order.objects.filter(portfolio__bdc_user=self.request.user).order_by('-date')
        return Response(OrderSerializer(orders, many=True).data)

class EditManualOrderAPI(generics.GenericAPIView):
    url = "bdc/orders/manual/edit/"
    serializer_class = OrderManualEditSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ticker = serializer.data['stock']
        try:
            stock = Stock.objects.get(ticker=ticker)
        except Stock.DoesNotExist:
            try:
                stock_name = get_stock_from_symbol(ticker)
            except:
                return Response({"error": "Invalid stock ticker: " + ticker})
            stock = Stock(ticker=ticker, name=stock_name)
            stock.save()

        order = Order.objects.get(uid=serializer.data['uid'])
        order.stock = stock
        order.quantity = serializer.data['quantity']
        order.value = serializer.data['price']
        order.is_buy_type = serializer.data['action'] == 'BUY'
        order.date = datetime.datetime.strptime(serializer.data['date'], "%Y-%m-%d").replace(tzinfo=pytz.UTC)
        order.save()
        orders = Order.objects.filter(portfolio__bdc_user=self.request.user).order_by('-date')
        return Response(OrderSerializer(orders, many=True).data)