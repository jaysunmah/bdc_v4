from rest_framework import generics, permissions
from rest_framework.response import Response

from . import helloworld
from .serializers import HelloWorldSerializer, TDAccountAPISerializer, TDAccountSerializer
from .models import TDAccount
from .tdascraper import TDAClient

class HelloWorldAPI(generics.GenericAPIView):
    url = "tdameritrade/helloworld/"
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

class LinkTDAccountAPI(generics.GenericAPIView):
    url = "tdameritrade/account/"
    serializer_class = TDAccountAPISerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            td_account = TDAccount.objects.get(bdc_user=self.request.user)
            td_client = TDAClient(td_account)
            res = td_client.get_positions()
            print(res)

            return Response(TDAccountSerializer(td_account).data)
        except TDAccount.DoesNotExist:
            return Response({
                "error": "No TD Account found associated with user"
            })

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            td_account = TDAccount.objects.get(bdc_user=self.request.user)
            for key, value in serializer.data.items():
                setattr(td_account, key, value)
            td_account.save()
        except TDAccount.DoesNotExist:
            td_account = TDAccount(
                bdc_user=self.request.user,
                refresh_token=serializer.data['refresh_token'],
                access_token=serializer.data['access_token'],
                account_id=serializer.data['account_id'],
                client_id=serializer.data['client_id']
            )
            td_account.save()
        return Response(TDAccountSerializer(td_account).data)

