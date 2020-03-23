from rest_framework import generics
from rest_framework.response import Response

from .serializers import PortfolioSerializer, PortfolioUpsertSerializer
from .models import Portfolio
from .brokerage_apis import get_brokerage

def get_portfolios(request, user):
    if 'brokerage' in request.GET:
        brokerage = get_brokerage(request.GET['brokerage']) if 'brokerage' in request.GET else None
        portfolios = Portfolio.objects.filter(bdc_user=user, brokerage=brokerage)
    else:
        portfolios = Portfolio.objects.filter(bdc_user=user)
    return portfolios

class PortfolioAPI(generics.GenericAPIView):
    url = "bdc/portfolio/"
    serializer_class = PortfolioUpsertSerializer

    def get(self, request):
        portfolios = get_portfolios(request, self.request.user)
        port_dict = {}
        for portfolio in portfolios:
            port_dict[portfolio.id] = PortfolioSerializer(portfolio).data
        return Response(port_dict)

    # Posts to this endpoint will upsert the portfolio
    # Endpoint is idempotent
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        brokerage = get_brokerage(serializer.data['brokerage'])

        try:
            portfolio = Portfolio.objects.get(bdc_user=self.request.user, brokerage=brokerage)
            portfolio.nickname = serializer.data['nickname']
        except Portfolio.DoesNotExist:
            portfolio = Portfolio(bdc_user=self.request.user, nickname=serializer.data['nickname'], brokerage=brokerage)
        portfolio.save()

        return Response(PortfolioSerializer(portfolio).data)
