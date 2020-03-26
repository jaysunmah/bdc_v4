import sys
import os
import requests

base_url = "localhost:8000"
endpoints = {
    'orders': '/api/bdc/orders/',
    'stock_quotes': '/api/bdc/stock/quotes/',
    'update_position_prices': '/api/bdc/positions/update_prices/',
    'positions': '/api/bdc/positions/',
    'port_hist': '/api/bdc/portfolio/history/'
}

token = os.environ["BDC_TOKEN"]

def make_request(method, url, data=None):
    print(data)
    res = requests.request(method,
                           url,
                           headers={'authorization': 'Token {}'.format(token), 'content-type': 'application/json'},
                           data=data).json()
    print(res)

if __name__ == "__main__":
    method = sys.argv[1]
    endpoint = sys.argv[2]
    if endpoint == 'port_hist':
        brokerage = sys.argv[3]
        url = "http://{}{}?brokerage={}".format(base_url, endpoints[endpoint], brokerage)
        make_request(method, url)
    elif endpoint == 'stock_quotes':
        stock = sys.argv[3]
        start = sys.argv[4]
        end = sys.argv[5]
        if method == 'GET':
            url = "http://{}{}?ticker={}&start_date={}&end_date={}".format(base_url, endpoints[endpoint], stock, start, end)
            make_request(method, url)
        else:
            url = "http://{}{}".format(base_url, endpoints[endpoint])
            make_request(method, url, data={ 'ticker': stock, 'start_date': start, 'end_date': end })

