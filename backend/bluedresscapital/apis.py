from rest_framework import generics
from rest_framework.response import Response

from .serializers import PortfolioSerializer
from .models import Portfolio


class PortfolioAPI(generics.GenericAPIView):
    url = "bdc/portfolio/"
    serializer_class = PortfolioSerializer

    def get(self, request):
        return Response({
            "status": "success"
        })
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "res": False
            })
        num = serializer.data['num']
        return Response({
            "res": helloworld.isPrime(num)
        })