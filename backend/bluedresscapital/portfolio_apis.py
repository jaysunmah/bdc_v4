import datetime
from decimal import Decimal

from rest_framework import generics
from rest_framework.response import Response

import pandas_market_calendars as mcal
import copy

from .serializers import PortfolioSerializer, PortfolioUpsertSerializer, PortfolioDeleteSerializer
from .models import Portfolio, Brokerage, Order, StockQuote
from backend.tdameritrade.util.helpers import upsert_orders as upsert_tda_orders
from backend.tdameritrade.util.helpers import upsert_positions as upsert_tda_positions
from backend.tdameritrade.models import TDAccount
from backend.tdameritrade.tdascraper import TDAClient
from backend.robinhood.util.helpers import upsert_orders as upsert_rh_orders
from backend.robinhood.util.helpers import upsert_positions as upsert_rh_positions
from backend.robinhood.models import RHAccount
from backend.robinhood.rhscraper import RHClient

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

    def post(self, request):
        """
        Posting to this endpoint will idemotently create the desired portfolio.
        If given a brokerage that's not of type web (i.e. rh or tda), it will also do the following:
            1. Create portfolio object (duh)
            2. Scrape all orders relevant to the portfolio
            3. Scrape all positions relevant to the portfolio
            4. (TODO) Load all quotes related to the orders in the portfolio
            5. Save them as meta data for the portfolio
        :param request:
        :return:
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        brokerage = Brokerage.objects.get(name=serializer.data['brokerage'])
        portfolio, _ = Portfolio.objects.get_or_create(bdc_user=self.request.user, brokerage=brokerage, nickname=serializer.data['nickname'])

        if brokerage.is_tda():
            td_account = TDAccount.objects.get(bdc_user=self.request.user)
            td_client = TDAClient(td_account)
            upsert_tda_orders(td_client, portfolio)
            upsert_tda_positions(td_client, portfolio)
        elif brokerage.is_rh():
            rh_account = RHAccount.objects.get(bdc_user=self.request.user)
            rh_client = RHClient(rh_account)
            upsert_rh_orders(rh_client, portfolio)
            upsert_rh_positions(rh_client, portfolio)

        return Response({
            "new_portfolio": PortfolioSerializer(portfolio).data,
            "port_id": portfolio.id
        })

class DeletePortfolioAPI(generics.GenericAPIView):
    url = "bdc/portfolio/delete/"
    serializer_class = PortfolioDeleteSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        Portfolio.objects.get(id=serializer.data['portfolio_id']).delete()
        port_dict = {}
        for portfolio in Portfolio.objects.filter(bdc_user=self.request.user):
            port_dict[portfolio.id] = PortfolioSerializer(portfolio).data

        import time
        time.sleep(2)
        return Response(port_dict)

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
                        stock_prices = StockQuote.objects.filter(stock=stock, date__lte=date_obj).order_by('-date')
                        if stock_prices.exists():
                            stock_price = stock_prices.first()
                            print("using stock price", stock_price.price, "on date", stock_price.date)
                        else:
                            raise Exception("couldn't find any prices for stock %s on date %s" % (stock.ticker, str(date_obj)))

                    if str(date_obj) in ['2019-11-13', '2019-11-14', '2019-11-15']:
                        if portfolio[stock] != Decimal(0):
                            print("{},{},{}".format(stock.ticker, stock_price.price, portfolio[stock]))

                    stocks_value += stock_price.price * portfolio[stock]

            if str(date_obj) in ['2019-11-13', '2019-11-14', '2019-11-15']:
                prev_portfolio = portfolio_snapshots[-1]
                for stock in portfolio:
                    if stock in prev_portfolio:
                        if prev_portfolio[stock] != portfolio[stock]:
                            print(stock, prev_portfolio[stock], " ---> ", portfolio[stock])
                    else:
                        print(stock, 0, " ---> ", portfolio[stock])
                print(str(date_obj), cash, stocks_value)
                for order in order_bucket:
                    print(order.stock, order.is_buy_type, order.quantity, order.value)
                print("")

            portfolio_value.append({'date': date_obj, 'cash': cash, 'stocks_value': stocks_value})
            portfolio_snapshots.append(copy.deepcopy(portfolio))

        for v in portfolio_value:
            print(str(v['date'])+","+str(v['cash'] + v['stocks_value']))

        return Response({"TODO": "TODO!!"})
