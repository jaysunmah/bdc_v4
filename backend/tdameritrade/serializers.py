from rest_framework import serializers
from .models import TDAccount

class HelloWorldSerializer(serializers.Serializer):
    num = serializers.IntegerField()

class TDAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = TDAccount
        fields = ('bdc_user', 'refresh_token', 'access_token', 'account_id', 'client_id')

class TDAccountAPISerializer(serializers.Serializer):
    refresh_token = serializers.CharField()
    access_token = serializers.CharField()
    account_id = serializers.CharField()
    client_id = serializers.CharField()