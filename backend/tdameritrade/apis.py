from rest_framework import generics
from rest_framework.response import Response

from . import helloworld
from .serializers import HelloWorldSerializer

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

urls = [
    ("tdameritrade/helloworld", HelloWorldAPI)
]