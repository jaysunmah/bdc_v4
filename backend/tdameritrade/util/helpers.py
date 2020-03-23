from rest_framework.response import Response
from backend.tdameritrade.tdascraper import TDAClient
from backend.bluedresscapital.models import Stock, Position, Portfolio
from backend.bluedresscapital.serializers import PositionSerializer
from backend.common.upsert_position import upsert_position

def upsert_positions(td_client: TDAClient, portfolio: Portfolio) -> Response:
    positions = td_client.get_positions()
    for positionObj in positions:
        upsert_position(positionObj, portfolio)
    all_positions = Position.objects.filter(portfolio=portfolio)
    return Response(PositionSerializer(all_positions, many=True).data)
