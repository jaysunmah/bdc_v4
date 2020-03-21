from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from backend.modules.tdameritrade import helloworld

class HelloWorldAPI(generics.GenericAPIView):
    def get(self, request):
        print(helloworld.helperFn())
        return Response({
            "status": "success"
        })