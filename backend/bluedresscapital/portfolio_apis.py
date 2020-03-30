import datetime
from decimal import Decimal

from knox.models import AuthToken
from rest_framework import generics
from rest_framework.response import Response

import pandas_market_calendars as mcal
import copy

from backend.bluedresscapital.stock_apis import upsert_portfolio_quotes
from .serializers import PortfolioSerializer, PortfolioUpsertSerializer, PortfolioDeleteSerializer
from .models import Portfolio, Order, StockQuote, RH_BROKERAGE, TDA_BROKERAGE, WEB_BROKERAGE
from backend.tdameritrade.util.helpers import upsert_orders as upsert_tda_orders
from backend.tdameritrade.util.helpers import upsert_transfers as upsert_tda_transfers
from backend.tdameritrade.models import TDAccount
from backend.tdameritrade.tdascraper import TDAClient
from backend.robinhood.util.helpers import upsert_orders as upsert_rh_orders
from backend.robinhood.util.helpers import upsert_transfers as upsert_rh_transfers
from backend.robinhood.models import RHAccount
from backend.robinhood.rhscraper import RHClient
from backend.common.helpers import upsert_positions
from knox.settings import CONSTANTS

def get_portfolios(request, user):
    if 'brokerage' in request.GET:
        portfolios = Portfolio.objects.filter(bdc_user=user, brokerage=request.GET['brokerage'])
    else:
        portfolios = Portfolio.objects.filter(bdc_user=user)
    return portfolios

def auth_user_via_token(token):
    try:
        return AuthToken.objects.get(token_key=token[:CONSTANTS.TOKEN_KEY_LENGTH])
    except AuthToken.DoesNotExist:
        return None

def get_or_create_portfolio(user, brokerage, nickname):
    try:
        portfolio, _ = Portfolio.objects.get_or_create(bdc_user=user, brokerage=brokerage,
                                                   nickname=nickname)
        return portfolio
    except:
        return None

def create_and_load_portfolio(token, nickname, brokerage, socket):
    """
    Comprehensive function to create portfolio. Will perform the following steps:a
        0. Authenticate user
        1. Create portfolio object - if one already exists, error out immediately.
        1.1 If brokerage == web, just return now. There's nothing to scrape after
        2. Scrape + upsert orders
        3. Scrape + upsert transfers
        4. Scrape + upsert stock quotes pertaining to the portfolio's orders - depends on step 2
        5. Compute + upsert portfolio positions - depends on step 2 and 4
        6. Compute + uspert portfolio performance - depends on steps 2, 3, and 4
        7. Mark done depends on steps 5 and 6
    :param token: token key for AuthToken
    :param nickname: brokerage nickname
    :param brokerage: brokerage type (i.e. rh, tda, web)
    :param socket: socket client to send updates to
    :return: Returns None, but will have socket send its results to the client when step 7 is done.
    """
    auth_token = auth_user_via_token(token)
    if auth_token is None:
        socket.mark_error("Invalid token")
        return
    user = auth_token.user
    portfolio = get_or_create_portfolio(user, brokerage, nickname)
    if portfolio is None:
        socket.mark_error("Portfolio with the given brokerage and user already exists")
        return
    elif brokerage == WEB_BROKERAGE:
        socket.mark_done(PortfolioSerializer(portfolio).data, portfolio.id)
        return

    if brokerage == TDA_BROKERAGE:
        tda_upsert_orders_and_transfers(user, portfolio, socket)
    elif brokerage == RH_BROKERAGE:
        rh_upsert_orders_and_transfers(user, portfolio, socket)
    else:
        socket.mark_error("Invalid brokerage type: " + brokerage)
        return
    socket.update_status("Upserting portfolio quotes...")
    upsert_portfolio_quotes(portfolio, user, socket=socket)
    # IMPORTANT only upsert positions after orders are upserted!
    socket.update_status("Upserting portfolio positions...")
    upsert_positions(portfolio)
    socket.mark_done(PortfolioSerializer(portfolio).data, portfolio.id)


def tda_upsert_orders_and_transfers(user, portfolio, socket):
    td_account = TDAccount.objects.get(bdc_user=user)
    td_client = TDAClient(td_account)
    socket.update_status("Scraping + upserting TDA orders...")
    upsert_tda_orders(td_client, portfolio)
    socket.update_status("Scraping + upserting TDA transfers...")
    upsert_tda_transfers(td_client, portfolio)

def rh_upsert_orders_and_transfers(user, portfolio, socket):
    rh_account = RHAccount.objects.get(bdc_user=user)
    rh_client = RHClient(rh_account)
    socket.update_status("Scraping + upserting RH orders...")
    upsert_rh_orders(rh_client, portfolio)
    socket.update_status("Scraping + upserting RH transfers...")
    upsert_rh_transfers(rh_client, portfolio)

class PortfolioAPI(generics.GenericAPIView):
    url = "bdc/portfolio/"
    serializer_class = PortfolioUpsertSerializer

    def get(self, request):
        portfolios = get_portfolios(request, self.request.user)
        port_dict = {}
        for portfolio in portfolios:
            port_dict[portfolio.id] = PortfolioSerializer(portfolio).data
        return Response(port_dict)

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
        time.sleep(1)
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
                    stocks_value += stock_price.price * portfolio[stock]

            portfolio_value.append({'date': date_obj, 'cash': cash, 'stocks_value': stocks_value})
            portfolio_snapshots.append(copy.deepcopy(portfolio))

        for v in portfolio_value:
            print(str(v['date'])+","+str(v['cash'] + v['stocks_value']))

        return Response({"TODO": "TODO!!"})
