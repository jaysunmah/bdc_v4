from pyrh import Robinhood, endpoints
from .models import RHAccount

class RHClient:
    def __init__(self, rh_account: RHAccount):
        self.rh = Robinhood()
        if not self.rh.login(username=rh_account.username, password=rh_account.password, qr_code=rh_account.qr_code):
            raise Exception("Error in logging into robinhood account")

    def get_positions(self):
        response = self.rh.session.get(endpoints.positions()).json()
        res = response['results']
        for position in res:
            print(position)

        return ""

    def get_orders(self):
        orders = self.rh.order_history()
        print(orders['results'])
        print(orders['next'])
        print(orders['previous'])

        return ""

