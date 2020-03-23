from rest_framework.response import Response

from backend.bluedresscapital.models import Portfolio, Position
from backend.bluedresscapital.serializers import PositionSerializer
from backend.robinhood.rhscraper import RHClient
from backend.common.upsert_position import upsert_position

def upsert_positions(rh_client: RHClient, portfolio: Portfolio) -> Response:
    positions = rh_client.get_positions()
    for positionObj in positions:
        upsert_position(positionObj, portfolio)
    all_positions = Position.objects.filter(portfolio=portfolio)
    return Response(PositionSerializer(all_positions, many=True).data)
