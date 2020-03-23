from rest_framework.response import Response
from backend.tdameritrade.tdascraper import TDAClient
from backend.bluedresscapital.models import Stock, Position, Portfolio
from backend.bluedresscapital.serializers import PositionSerializer

def upsert_positions(td_client: TDAClient, portfolio: Portfolio):
    positions = td_client.get_positions()
    for positionObj in positions:
        try:
            stock = Stock.objects.get(ticker=positionObj['symbol'])
        except Stock.DoesNotExist:
            stock = Stock(ticker=positionObj['symbol'], name='')
            stock.save()

        try:
            position = Position.objects.get(portfolio=portfolio, stock=stock)
            position.quantity = positionObj['quantity']
            position.value = positionObj['value']
        except Position.DoesNotExist:
            position = Position(portfolio=portfolio, quantity=positionObj['quantity'], value=positionObj['value'], stock=stock)
        position.save()

    all_positions = Position.objects.filter(portfolio=portfolio)
    return Response(PositionSerializer(all_positions, many=True).data)
