from decimal import Decimal

from pyrh import Robinhood, endpoints
import requests
from .models import RHAccount, Instrument
from backend.bluedresscapital.models import Stock, StockQuote


class RHClient:
    def __init__(self, rh_account: RHAccount):
        self.rh = Robinhood()
        if not self.rh.login(username=rh_account.username, password=rh_account.password, qr_code=rh_account.qr_code):
            raise Exception("Error in logging into robinhood account")

    def get_positions(self):
        response = self.rh.session.get(endpoints.positions()).json()
        res = self.get_full_results(response)

        def get_position(position):
            stock = get_stock_from_instrument_id(get_instrument_id_from_url(position['instrument']))
            return {
                'symbol': stock,
                'quantity': Decimal(position['quantity']),
                'value': Decimal(position['quantity']) * get_latest_stock_price(stock)
            }
        positions = [get_position(position) for position in res]

        return positions

    def get_orders(self):
        response = self.rh.session.get(endpoints.orders()).json()
        res = self.get_full_results(response)

        def filter_order(order):
            return len(order['executions']) > 0
        def get_order(order):
            execution = order['executions'][0]
            return {
                'uid': order['id'],
                'instruction': order['side'],
                'date': execution['timestamp'],
                'stock': get_stock_from_instrument_id(get_instrument_id_from_url(order['instrument'])),
                'quantity': Decimal(order['quantity']),
                'value': Decimal(execution['price'])
            }
        return [get_order(order) for order in res if filter_order(order)]

    def get_transfers(self):
        response = self.rh.session.get(endpoints.ach("transfers")).json()
        res = self.get_full_results(response)

        def filter_transfer(transfer):
            return transfer['state'] == 'completed' and (transfer['direction'] == 'deposit' or transfer['direction'] == 'withdraw')

        def get_transfer(transfer):
            return {
                'uid': transfer['id'],
                'direction': transfer['direction'],
                'amount': Decimal(transfer['amount']),
                'date': transfer['expected_landing_date']
            }
        return [get_transfer(t) for t in res if filter_transfer(t)]

    def get_full_results(self, response):
        res = response['results']
        while response['next'] is not None:
            response = self.rh.session.get(response['next']).json()
            res += response['results']
        return res

def get_latest_stock_price(ticker):
    try:
        stock = Stock.objects.get(ticker=ticker)
    except Stock.DoesNotExist:
        stock = Stock(ticker=ticker, name=get_stock_from_symbol(ticker))
        stock.save()
    quote_query = StockQuote.objects.filter(stock=stock).order_by('-date')
    if quote_query.exists():
        return quote_query.first().price
    # TODO(ma): maybe we should fetch stock price live here??
    return Decimal(0)

def get_instrument_id_from_url(url):
    return url.replace('https://api.robinhood.com/instruments/', '')[:-1]

def get_stock_from_instrument_id(instrument_id):
    try:
        instrument = Instrument.objects.get(instrument_id=instrument_id)
    except Instrument.DoesNotExist:
        url = "https://api.robinhood.com/instruments/{}/".format(instrument_id)
        resp = requests.get(url).json()
        ticker = resp['symbol']
        try:
            stock = Stock.objects.get(ticker=ticker)
        except Stock.DoesNotExist:
            stock = Stock(ticker=ticker, name=resp['simple_name'])
            stock.save()
        instrument = Instrument(stock=stock, instrument_id=instrument_id)
        instrument.save()
    return instrument.stock.ticker

def get_stock_from_symbol(symbol):
    url = "https://api.robinhood.com/instruments/?symbol={}".format(symbol)
    resp = requests.get(url).json()
    return resp['results'][0]['simple_name']
