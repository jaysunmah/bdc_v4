import datetime
from decimal import Decimal

from rest_framework import generics
from rest_framework.response import Response

import pandas_market_calendars as mcal
import copy

from .serializers import PortfolioSerializer, PortfolioUpsertSerializer
from .models import Portfolio, Brokerage, Order, StockQuote


def get_portfolios(request, user):
    if 'brokerage' in request.GET:
        brokerage = Brokerage.objects.get(name=request.GET['brokerage'])
        portfolios = Portfolio.objects.filter(bdc_user=user, brokerage=brokerage)
    else:
        portfolios = Portfolio.objects.filter(bdc_user=user)
    return portfolios

class PortfolioAPI(generics.GenericAPIView):
    url = "bdc/portfolio/"
    serializer_class = PortfolioUpsertSerializer

    def get(self, request):
        portfolios = get_portfolios(request, self.request.user)
        port_dict = {}
        for portfolio in portfolios:
            port_dict[portfolio.id] = PortfolioSerializer(portfolio).data
        return Response(port_dict)

    # Posts to this endpoint will upsert the portfolio
    # Endpoint is idempotent
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        brokerage = Brokerage.objects.get(name=serializer.data['brokerage'])
        try:
            portfolio = Portfolio.objects.get(bdc_user=self.request.user, brokerage=brokerage)
            portfolio.nickname = serializer.data['nickname']
        except Portfolio.DoesNotExist:
            portfolio = Portfolio(bdc_user=self.request.user, nickname=serializer.data['nickname'], brokerage=brokerage)
        portfolio.save()
        return Response(PortfolioSerializer(portfolio).data)

class PortfolioHistoryAPI(generics.GenericAPIView):
    url = "bdc/portfolio/history/"

    def get(self, request):
        if 'brokerage' not in request.GET:
            return Response({"error": "brokerage required in url parameter"})
        brokerage = Brokerage.objects.get(name=request.GET['brokerage'])
        portfolio = Portfolio.objects.get(bdc_user=self.request.user, brokerage=brokerage)
        orders = Order.objects.filter(portfolio=portfolio).order_by('date')
        if not orders.exists():
            return Response({"error": "no orders found in db for portfolio"})
        start = orders.first().date
        end = orders.last().date
        nyse = mcal.get_calendar('NYSE')

        """
        Fetch market close date time per day. For each order, we bucket them based on
        the "greatest" day that is <= their order date. We need to map the following:
        stock bought after hours (market closed for w/e reason) will be mapped to the next day that market opens
        """

        dates_df = nyse.schedule(start_date=start, end_date=end)
        date_ends = dates_df['market_close'].to_list()
        dates = dates_df.index.values
        order_buckets = [[] for _ in range(len(date_ends))]
        date_idx = 0
        order_idx = 0
        while date_idx < len(date_ends) and order_idx < len(orders):
            order = orders[order_idx]
            curr_date = date_ends[date_idx]
            if curr_date >= order.date:
                order_buckets[date_idx].append(order)
                order_idx += 1
            else:
                date_idx += 1

        portfolio_snapshots = []
        portfolio = {}
        cash = 70000
        portfolio_value = []
        for i in range(len(order_buckets)):
            order_bucket = order_buckets[i]
            date_obj = datetime.date.fromisoformat(str(dates[i])[:10])
            # TODO remove me!
            print(date_obj)
            for order in order_bucket:
                ticker = order.stock
                if ticker not in portfolio:
                    portfolio[ticker] = Decimal(0)
                if order.is_buy_type:
                    # Subtract from cash, we will re-add to this value after
                    cash -= order.quantity * order.value
                    portfolio[ticker] += order.quantity
                else:
                    cash += order.quantity * order.value
                    portfolio[ticker] -= order.quantity

            stocks_value = Decimal(0)
            for stock in portfolio:
                if portfolio[stock] > Decimal(0):
                    try:
                        stock_price = StockQuote.objects.get(stock=stock, date=date_obj)
                    except StockQuote.DoesNotExist:
                        print("stock price doesnt exist for stock %s on date %s, trying to fall back on a previous date" % (stock.ticker, str(date_obj)))
                        stock_prices = StockQuote.objects.filter(date__lte=date_obj).order_by('-date')
                        if stock_prices.exists():
                            stock_price = stock_prices.first()
                        else:
                            raise Exception("couldn't find any prices for stock %s on date %s" % (stock.ticker, str(date_obj)))
                    stocks_value += stock_price.price * portfolio[stock]

            portfolio_value.append({'date': date_obj, 'cash': cash, 'stocks_value': stocks_value})
            portfolio_snapshots.append(copy.deepcopy(portfolio))

        for v in portfolio_value:
            print(str(v['date'])+","+str(v['cash'] + v['stocks_value']))

        return Response({"TODO": "TODO!!"})
