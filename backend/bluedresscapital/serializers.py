from rest_framework import serializers
from .models import Portfolio, Position, Stock, StockQuote

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

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ('ticker', 'name')

class StockUpsertSerializer(serializers.Serializer):
    ticker = serializers.CharField()


class StockQuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockQuote
        fields = ('stock', 'date', 'price')

class StockQuoteUpsertSerializer(serializers.Serializer):
    ticker = serializers.CharField()
    start_date = serializers.DateField()
    end_date = serializers.DateField()