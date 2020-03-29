import datetime
import pytz
from rest_framework.response import Response

from backend.bluedresscapital.models import Portfolio, Stock, Order, Transfer
from backend.bluedresscapital.serializers import OrderSerializer, TransferSerializer
from backend.robinhood.rhscraper import RHClient

def upsert_orders(rh_client: RHClient, portfolio: Portfolio) -> Response:
    rh_orders = rh_client.get_orders()
    def get_order(t):
        stock, created = Stock.objects.get_or_create(ticker=t['stock'], defaults={'name': ''})
        if created:
            print("Created stock because it wasn't found in the db: ", stock.ticker)

        try:
            date = datetime.datetime.strptime(t['date'], "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=pytz.UTC)
        except ValueError:
            date = datetime.datetime.strptime(t['date'], "%Y-%m-%dT%H:%M:%S.%fZ").replace(tzinfo=pytz.UTC)

        return Order(
            uid=t['uid'],
            portfolio=portfolio,
            stock=stock,
            quantity=t['quantity'],
            value=t['value'],
            is_buy_type=t['instruction'] == 'buy',
            manually_added=False,
            date=date)
    orders = [get_order(t) for t in rh_orders]
    Order.objects.bulk_create(orders, ignore_conflicts=True)
    return Response(OrderSerializer(orders, many=True).data)

def upsert_transfers(rh_client: RHClient, portfolio: Portfolio) -> Response:
    rh_transfers = rh_client.get_transfers()
    def get_transfer(t):
        return Transfer(
            uid=t['uid'],
            portfolio=portfolio,
            amount=t['amount'],
            is_deposit_type=t['direction'] == 'deposit',
            manually_added=False,
            date=datetime.date.fromisoformat(t['date'])
        )
    transfers = [get_transfer(t) for t in rh_transfers]
    Transfer.objects.bulk_create(transfers, ignore_conflicts=True)
    return Response(TransferSerializer(transfers, many=True).data)