from rest_framework import generics
from rest_framework.response import Response

from .serializers import PositionSerializer, PositionUpsertSerializer, UpdatePositionStockPricesSerializer
from .models import Position, Portfolio, Brokerage
from .portfolio_apis import get_portfolios
from backend.tdameritrade.models import TDAccount
from backend.tdameritrade.tdascraper import TDAClient
from backend.common.helpers import upsert_positions

class PositionAPI(generics.GenericAPIView):
    url = "bdc/positions/"
    serializer_class = PositionUpsertSerializer

    def get(self, request):
        portfolios = get_portfolios(request, self.request.user)
        positions = Position.objects.filter(portfolio__in=portfolios).order_by('-value')

        return Response(PositionSerializer(positions, many=True).data)

    # Posts to this endpoint will cause a mass update to all positions at brokerage
    # Endpoint is idempotent assuming no changes were made to the underlying positions
    # at the brokerage
    def post(self, request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        brokerage = Brokerage.objects.get(name=serializer.data['brokerage'])
        portfolio = Portfolio.objects.get(bdc_user=self.request.user, brokerage=brokerage)
        return upsert_positions(portfolio)

class UpdatePositionStockPricesAPI(generics.GenericAPIView):
    url = "bdc/positions/update_prices/"
    serializer_class = UpdatePositionStockPricesSerializer

    def post(self, request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        brokerage = Brokerage.objects.get(name=serializer.data['brokerage'])
        positions = Position.objects.filter(portfolio__bdc_user=self.request.user, portfolio__brokerage=brokerage)
        td_account = TDAccount.objects.get(bdc_user=self.request.user)
        for position in positions:
            print("Updating ", position.stock.ticker)
            position.stock.update_price(TDAClient(td_account))
        return Response({"status": "success"})