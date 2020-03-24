import datetime
from decimal import Decimal

import requests
from .models import TDAccount

def has_expired_access_token(res):
	return 'error' in res and res['error'] == 'The access token being passed has expired or is invalid.'

class TDAClient:
	def __init__(self, tdAccount: TDAccount):
		self.access_token = tdAccount.client_id
		self.refresh_token = tdAccount.refresh_token
		self.account_id = tdAccount.account_id
		self.client_id = tdAccount.client_id
		self.redirect_uri = 'http%3A%2F%2Flocalhost'
		self.TD_QUOTE_URL_1 = "https://api.tdameritrade.com/v1/marketdata/"
		self.td_account = tdAccount

	def get_accounts_url(self):
		return "https://api.tdameritrade.com/v1/accounts/{}".format(self.account_id)

	def get_transactions_url(self):
		return self.get_accounts_url() + "/transactions"

	def get_validate_url(self):
		return "https://auth.tdameritrade.com/auth?response_type=code&redirect_uri={}&client_id={}%40AMER.OAUTHAP".format(self.redirect_uri, self.client_id)

	def get_td_quote_url(self, symbol):
		return "https://api.tdameritrade.com/v1/marketdata/{}/pricehistory".format(symbol)

	def write_tokens_to_db(self):
		self.td_account.access_token = self.access_token
		self.td_account.refresh_token = self.refresh_token
		self.td_account.save()

	def authenticate(self):
		url = 'https://api.tdameritrade.com/v1/oauth2/token'
		data = {
			'grant_type': 'refresh_token',
			'refresh_token' : self.refresh_token,
			'access_type' : 'offline',
			'client_id' : self.client_id + '@AMER.OAUTHAP',
			'redirect_uri' : self.redirect_uri
		}
		response = requests.post(url, data).json()
		self.access_token = response['access_token']
		self.refresh_token = response['refresh_token']
		self.write_tokens_to_db()

	def get_auth_header(self):
		return {
			'Authorization': 'Bearer ' + self.access_token
		}

	def get_positions(self):
		self.authenticate()
		url = self.get_accounts_url()
		res = requests.get(url, params={'fields': 'positions'}, headers=self.get_auth_header()).json()
		positions = res['securitiesAccount']['positions']
		cash = float(res['securitiesAccount']['currentBalances']['cashBalance'])
		positions = [
			{
				'symbol': x['instrument']['symbol'],
				'quantity': int(x['longQuantity']),
				'value': float(x['marketValue'])
			} for x in positions]
		positions += [{'symbol' : '_cash', 'quantity': 1, 'value': cash}]
		positions = sorted(positions, key = lambda x: x['value'], reverse=True)
		return positions

	def get_transactions(self):
		self.authenticate()
		url = self.get_transactions_url()
		res = requests.get(url, headers=self.get_auth_header()).json()
		def get_trade(t):
			return {
				'uid': t['transactionId'],
				'instruction': t['transactionItem']['instruction'],
				'date': t['orderDate'] if 'orderDate' in t else t['transactionDate'],
				'stock': t['transactionItem']['instrument']['symbol'],
				'quantity': Decimal(t['transactionItem']['amount']),
				'value': Decimal(t['transactionItem']['price'])
			}
		return [get_trade(t) for t in res if t['type'] == 'TRADE']

	def get_historical_quote(self, ticker: str, start: datetime.datetime, end: datetime.datetime):
		self.authenticate()
		url = self.get_td_quote_url(ticker)
		params = {
			'periodType': 'year',
			'period': 1,
			'frequency': 1,
			'frequencyType': 'daily',
			'startDate': int(start.timestamp()) * 1000,
			'endDate': int(end.timestamp()) * 1000
		}
		res = requests.get(url, params=params, headers=self.get_auth_header()).json()

		return [{
			'close': float(quote['close']),
			'date': datetime.datetime.fromtimestamp(quote['datetime'] / 1000)
		} for quote in res['candles']]
