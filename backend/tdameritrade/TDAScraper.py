import requests
from backend.tdameritrade.td_urls import td_urls

class TDAScraper:
	def __init__(self, access_token=None, refresh_token=None):
		self.access_token = access_token if access_token else open("utils/data_provider/tokens/tda_access_token.txt", "r").read()
		self.refresh_token = refresh_token if refresh_token else open("utils/data_provider/tokens/tda_refresh_token.txt", "r").read()
		self.client_id = 'NF01YF0UPHSQUC9CSCYBLA6ULTRRDI9P'
		self.redirect_uri = 'http%3A%2F%2Flocalhost'

	def write_tokens_to_file(self):
		open('utils/data_provider/tokens/tda_access_token.txt', 'w').write(self.access_token)
		open('utils/data_provider/tokens/tda_refresh_token.txt', 'w').write(self.refresh_token)

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
		print(response)
		self.access_token = response['access_token']
		self.refresh_token = response['refresh_token']
		self.write_tokens_to_file()

	def get_positions(self):
		def get_positions_data():
			url = td_urls.TD_ACCOUNTS_URL
			return requests.get(url, params={'fields' : 'positions'}, headers={'Authorization': 'Bearer ' + self.access_token}).json()
		response = None
		try:
			response = get_positions_data()
		except:
			self.authenticate()
			response = get_positions_data()
		finally:
			positions = response['securitiesAccount']['positions']
			cash = float(response['securitiesAccount']['currentBalances']['cashBalance'])
			res = [{
				'symbol': x['instrument']['symbol'],
				'quantity': int(x['longQuantity']),
				'value': float(x['marketValue'])} for x in positions]

			res += [{'symbol' : '_cash', 'quantity': 1, 'value': cash}]
			res = sorted(res, key = lambda x: -x['value'])
			return res

	def get_transactions(self):
		def get_transactions_data():
			url = td_urls.TD_TRANSACTIONS_URL
			return requests.get(url, headers={'Authorization': 'Bearer ' + self.access_token}).json()

		try:
			return get_transactions_data()
		except:
			self.authenticate()
			return get_transactions_data()

	def get_historical_quote(self, symbol):
		def get_historical_quote_data(symbol):
			url = td_urls.TD_QUOTE_URL_1 + symbol + td_urls.TD_QUOTE_URL_2
			return requests.get(url, params={'periodType': 'year',
				'period': 1,
				'frequency': 1,
				'frequencyType' : 'daily',
				'startDate': int(startDate.timestamp() * 1000),
				'endDate': int(endDate.timestamp() * 1000)},
				headers={'Authorization': 'Bearer ' + self.access_token}).json()
		try:
			return get_historical_quote(symbol)
		except:
			self.authenticate()
			return get_historical_quote(symbol)

	def get_historical_quotes_from_trades(self, trades):
		for x in trades:
			d = {}
			if x.name == 'StockTrade' and x.symbol not in d:
				d[x.symbol] = get_historical_quote(x.symbol)
		pickle.dump(d, open('quotes_pickle.pickle', 'wb'))
		return d
