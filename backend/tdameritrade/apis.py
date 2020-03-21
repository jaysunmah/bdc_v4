from rest_framework import generics
from rest_framework.response import Response
from django.conf.urls import include, url

from . import helloworld
from .serializers import HelloWorldSerializer

api_format = "^tdameritrade/{}$"

class HelloWorldAPI(generics.GenericAPIView):
    serializer_class = HelloWorldSerializer
    def get(self, request):
        print(helloworld.helperFn())
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

tdameritrade_url_patterns = [
    url(api_format.format("helloworld"), HelloWorldAPI.as_view()),
]