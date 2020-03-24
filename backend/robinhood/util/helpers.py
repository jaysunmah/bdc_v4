import datetime

import pytz
from rest_framework.response import Response

from backend.bluedresscapital.models import Portfolio, Position, Stock, Order
from backend.bluedresscapital.serializers import PositionSerializer, OrderSerializer
from backend.robinhood.rhscraper import RHClient
from backend.common.upsert_position import upsert_position

def upsert_positions(rh_client: RHClient, portfolio: Portfolio) -> Response:
    positions = rh_client.get_positions()
    for positionObj in positions:
        upsert_position(positionObj, portfolio)
    all_positions = Position.objects.filter(portfolio=portfolio)
    return Response(PositionSerializer(all_positions, many=True).data)

def upsert_orders(rh_client: RHClient, portfolio: Portfolio) -> Response:
    transactions = rh_client.get_orders()
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
            date=date)

    orders = [get_order(t) for t in transactions]
    Order.objects.bulk_create(orders, ignore_conflicts=True)
    return Response(OrderSerializer(orders, many=True).data)