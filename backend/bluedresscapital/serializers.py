from rest_framework import serializers
from .models import Portfolio, Position

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ('bdc_user', 'nickname', 'brokerage')

class PortfolioUpsertSerializer(serializers.Serializer):
    nickname = serializers.CharField()
    brokerage = serializers.CharField()

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ('portfolio', 'quantity', 'value', 'stock')

class PositionUpsertSerializer(serializers.Serializer):
    brokerage = serializers.CharField()