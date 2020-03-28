from rest_framework.response import Response
import datetime
from backend.tdameritrade.tdascraper import TDAClient
from backend.bluedresscapital.models import Stock, Position, Portfolio, Order
from backend.bluedresscapital.serializers import PositionSerializer, OrderSerializer
from backend.common.upsert_position import upsert_position

def upsert_positions(td_client: TDAClient, portfolio: Portfolio) -> Response:
    positions = td_client.get_positions()
    for positionObj in positions:
        upsert_position(positionObj, portfolio)
    all_positions = Position.objects.filter(portfolio=portfolio)
    return Response(PositionSerializer(all_positions, many=True).data)

def upsert_orders(td_client: TDAClient, portfolio: Portfolio) -> Response:
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
            date=datetime.datetime.strptime(t['date'], "%Y-%m-%dT%H:%M:%S%z"))
    orders = [get_order(t) for t in transactions]
    Order.objects.bulk_create(orders, ignore_conflicts=True)
    return Response(OrderSerializer(orders, many=True).data)

def upsert_transfers(td_client: TDAClient, portfolio: Portfolio) -> Response:
    return Response({"TOTO": "TD!!!"})