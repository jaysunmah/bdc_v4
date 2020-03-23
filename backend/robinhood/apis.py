from rest_framework import generics, permissions
from rest_framework.response import Response

from .models import RHAccount
from .serializers import RHAccountSerializer, RHAccountAPISerializer
from .rhscraper import RHClient

class LinkRHAccountAPI(generics.GenericAPIView):
    url = "robinhood/account/"
    serializer_class = RHAccountAPISerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            rh_account = RHAccount.objects.get(bdc_user=self.request.user)

            rh_client = RHClient(rh_account)
            rh_client.get_positions()

            return Response(RHAccountSerializer(rh_account).data)
        except RHAccount.DoesNotExist:
            return Response({
                "error": "No RH Account found associated with user"
            })

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            rh_account = RHAccount.objects.get(bdc_user=self.request.user)
            for key, value in serializer.data.items():
                setattr(rh_account, key, value)
        except RHAccount.DoesNotExist:
            rh_account = RHAccount(
                bdc_user=self.request.user,
                username=serializer.data['username'],
                password=serializer.data['password'],
                qr_code=serializer.data['qr_code']
            )
        rh_account.save()
        return Response(RHAccountSerializer(rh_account).data)

