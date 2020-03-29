import datetime
from decimal import Decimal

from rest_framework import generics, permissions
from rest_framework.response import Response

from backend.bluedresscapital.models import save_quotes_ignore_exists
from .serializers import StockUpsertSerializer, StockQuoteUpsertSerializer, StockQuoteSerializer, BrokerageInputSerializer
from .models import StockQuote, Stock, Portfolio, Order
from backend.tdameritrade.tdascraper import TDAClient
from backend.tdameritrade.models import TDAccount


class StockAPI(generics.GenericAPIView):
    url = "bdc/stock/"
    serializer_class = StockUpsertSerializer

    def get(self, request):
        """
        Fetches stock from url query param?
        :param request:
        :return:
        """
        return Response({"status": "TODO"})

    def post(self, request) -> Response:
        """
        Updates the input stock? (by update, I mean just fetch the company name)
        :param request:
        :return:
        """
        return Response({"status": "TODO"})

class StockQuoteAPI(generics.GenericAPIView):
    url = "bdc/stock/quotes/"
    serializer_class = StockQuoteUpsertSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Fetches all historical stock quote data on input stock
        :param request: ticker (required), start_date (optional), end_date (optional)
        :return:
        """
        if 'ticker' not in request.GET:
            return Response({'error': 'ticker is required in url parameter'})
        ticker = request.GET['ticker']
        start = datetime.datetime.strptime(request.GET['start_date'], "%Y-%m-%d") if 'start_date' in request.GET else None
        end = datetime.datetime.strptime(request.GET['end_date'], "%Y-%m-%d") if 'end_date' in request.GET else None
        stock = Stock.objects.get(ticker=ticker)
        if start is None:
            if end is None:
                stock_quotes = StockQuote.objects.filter(stock=stock)
            else:
                stock_quotes = StockQuote.objects.filter(stock=stock, date__lte=end)
        else:
            if end is None:
                stock_quotes = StockQuote.objects.filter(stock=stock, date__gte=start)
            else:
                stock_quotes = StockQuote.objects.filter(stock=stock, date__gte=start, date__lte=end)
        return Response(StockQuoteSerializer(stock_quotes, many=True).data)

    def post(self, request):
        """
        Updates input stock historical quote data from start_date to end_date
        :param request:
        :return:
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ticker = serializer.data['ticker']
        start = datetime.datetime.strptime(serializer.data['start_date'], "%Y-%m-%d")
        end = datetime.datetime.strptime(serializer.data['end_date'], "%Y-%m-%d")
        stock = upsert_quotes(ticker, start, end, self.request.user)

        stock_quotes = StockQuote.objects.filter(stock=stock, date__gte=start, date__lte=end)
        return Response(StockQuoteSerializer(stock_quotes, many=True).data)

def upsert_quotes(ticker, start, end, user):
    print("Upserting quotes for %s from %s to %s" % (ticker, start, end))
    td_account = TDAccount.objects.get(bdc_user=user)
    td_client = TDAClient(td_account)
    quotes = td_client.get_historical_quote(ticker, start, end)
    stock = Stock.objects.get(ticker=ticker)
    save_quotes_ignore_exists(quotes, stock)
    return stock

class LoadPortfolioStockPricesAPI(generics.GenericAPIView):
    url = "bdc/stock/portfolio/load_quotes/"
    serializer_class = BrokerageInputSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        This is a lengthy api call. Given (user, brokerage), it will
        1. Fetch portfolio(user=user, brokerage=brokerage)
        2. Fetch all orders tied to the portfolio
        3. Group by stock
        4. For each stock, upsert stock quotes from min to max date of orders
        :param request:
        :return:
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        portfolio = Portfolio.objects.get(bdc_user=self.request.user, brokerage=serializer.data['brokerage'])
        orders = Order.objects.filter(portfolio=portfolio).order_by('date')

        stock_count = {}
        stock_min_date = {}
        stock_max_date = {}

        for order in orders:
            ticker = order.stock.ticker
            if ticker not in stock_count:
                stock_min_date[ticker] = order.date
                stock_count[ticker] = 0

            if order.is_buy_type:
                stock_count[ticker] += order.quantity
            else:
                stock_count[ticker] -= order.quantity

            if stock_count[ticker] == Decimal(0):
                stock_max_date[ticker] = order.date

        for stock in stock_count:
            start_date = stock_min_date[stock]
            if stock in stock_max_date and stock_count[stock] == Decimal(0):
                end_date = stock_max_date[stock]
            else:
                end_date = datetime.datetime.now()
            upsert_quotes(stock, start_date, end_date, self.request.user)

        return Response({"status": "success"})