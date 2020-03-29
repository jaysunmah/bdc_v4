from rest_framework.response import Response
import datetime
from backend.tdameritrade.tdascraper import TDAClient
from backend.bluedresscapital.models import Stock, Portfolio, Order, Transfer
from backend.bluedresscapital.serializers import OrderSerializer, TransferSerializer

def upsert_orders(td_client: TDAClient, portfolio: Portfolio) -> Response:
    print("Scraping orders...")
    transactions = td_client.get_transactions()
    def get_order(t):
        stock, created = Stock.objects.get_or_create(ticker=t['stock'], defaults={'name': ''})
        if created:
            print("Created stock because it wasn't found in the db: ", stock.ticker)
        return Order(
            uid=t['uid'],
            portfolio=portfolio,
            stock=stock,
            quantity=t['quantity'],
            value=t['value'],
            is_buy_type=t['instruction'] == 'BUY',
            manually_added=False,
            date=datetime.datetime.strptime(t['date'], "%Y-%m-%dT%H:%M:%S%z"))
    print("Fetched " + str(len(transactions)) + " orders!")
    orders = [get_order(t) for t in transactions]
    print("Saving %d orders..." % (len(orders)))
    Order.objects.bulk_create(orders, ignore_conflicts=True, batch_size=100)
    print("Saved!")
    return Response(OrderSerializer(orders, many=True).data)

def upsert_transfers(td_client: TDAClient, portfolio: Portfolio) -> Response:
    td_transfers = td_client.get_transfers()
    def get_transfer(t):
        return Transfer(
            uid=t['uid'],
            portfolio=portfolio,
            amount=t['amount'],
            is_deposit_type=t['is_deposit_type'],
            manually_added=False,
            date=datetime.date.fromisoformat(t['date'][:10])
        )
    transfers = [get_transfer(t) for t in td_transfers]
    Transfer.objects.bulk_create(transfers, ignore_conflicts=True)
    return Response(TransferSerializer(transfers, many=True).data)