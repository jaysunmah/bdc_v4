from rest_framework import generics
from rest_framework.response import Response

from .serializers import PositionSerializer, PositionUpsertSerializer, PortfolioSerializer
from .models import Position, Portfolio
from .portfolio_apis import get_portfolios
from .brokerage_apis import get_brokerage
from backend.tdameritrade.models import TDAccount
from backend.tdameritrade.tdascraper import TDAClient
from backend.tdameritrade.util.helpers import upsert_positions

class PositionAPI(generics.GenericAPIView):
    url = "bdc/positions/"
    serializer_class = PositionUpsertSerializer

    def get(self, request):
        portfolios = get_portfolios(request, self.request.user)
        positions = Position.objects.filter(portfolio__in=portfolios)

        id_port_map = {}
        for portfolio in portfolios:
            id_port_map[portfolio.id] = PortfolioSerializer(portfolio).data

        return Response(PositionSerializer(positions, many=True).data)

    # Posts to this endpoint will cause a mass update to all positions at brokerage
    # Endpoint is idempotent assuming no changes were made to the underlying positions
    # at the brokerage
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        brokerage = get_brokerage(serializer.data['brokerage'])

        if brokerage.is_tda():
            td_account = TDAccount.objects.get(bdc_user=self.request.user)
            portfolio = Portfolio.objects.get(bdc_user=self.request.user, brokerage=brokerage)
            return upsert_positions(TDAClient(td_account), portfolio)

        return Response({"error": "Unhandled brokerage type: %s" % brokerage})

