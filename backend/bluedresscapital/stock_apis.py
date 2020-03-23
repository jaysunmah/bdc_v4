import datetime

from rest_framework import generics, permissions
from rest_framework.response import Response

from .serializers import StockUpsertSerializer, StockQuoteUpsertSerializer, StockQuoteSerializer
from .models import StockQuote, Stock
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
        start = serializer.data['start_date']
        end = serializer.data['end_date']

        td_account = TDAccount.objects.get(bdc_user=self.request.user)
        td_client = TDAClient(td_account)
        quotes = td_client.get_historical_quote(ticker, datetime.datetime.strptime(start, "%Y-%m-%d"), datetime.datetime.strptime(end, "%Y-%m-%d"))

        stock = Stock.objects.get(ticker=ticker)
        for quote in quotes:
            try:
                stock_quote = StockQuote.objects.get(stock=stock, date=quote['date'])
                stock_quote.price = quote['close']
            except StockQuote.DoesNotExist:
                stock_quote = StockQuote(stock=stock, date=quote['date'], price=quote['close'])
            stock_quote.save()

        stock_quotes = StockQuote.objects.filter(stock=stock, date__gte=start, date__lte=end)
        return Response(StockQuoteSerializer(stock_quotes, many=True).data)