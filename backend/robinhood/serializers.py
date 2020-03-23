from rest_framework import serializers
from .models import RHAccount

class HelloWorldSerializer(serializers.Serializer):
    num = serializers.IntegerField()

class RHAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = RHAccount
        fields = ('bdc_user', 'username', 'password', 'qr_code')

class RHAccountAPISerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    qr_code = serializers.CharField()
