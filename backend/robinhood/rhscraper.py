from pyrh import Robinhood, endpoints
import requests
from .models import RHAccount, Instrument
from backend.bluedresscapital.models import Stock

class RHClient:
    def __init__(self, rh_account: RHAccount):
        self.rh = Robinhood()
        if not self.rh.login(username=rh_account.username, password=rh_account.password, qr_code=rh_account.qr_code):
            raise Exception("Error in logging into robinhood account")

    def get_positions(self):
        response = self.rh.session.get(endpoints.positions()).json()
        res = response['results']
        while response['next'] is not None and response['next'] != "None":
            response = self.rh.session.get(response['next']).json()
            res += response['results']

        positions = [{
            'symbol': get_stock_from_instrument_id(get_instrument_id_from_url(position['instrument'])),
            'quantity': float(position['quantity']),
            'value': float(position['quantity']) * get_latest_stock_price()
        } for position in res]

        return positions

    def get_orders(self):
        orders = self.rh.order_history()
        print(orders['results'])
        print(orders['next'])
        print(orders['previous'])

        return ""

def get_latest_stock_price():
    # TODO
    return 42

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
    print(resp)
