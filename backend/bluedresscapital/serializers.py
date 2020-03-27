from rest_framework import serializers
from .models import Portfolio, Position, Stock, StockQuote, Order

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ('bdc_user', 'nickname', 'brokerage')

class PortfolioUpsertSerializer(serializers.Serializer):
    nickname = serializers.CharField()
    brokerage = serializers.CharField()

class PortfolioDeleteSerializer(serializers.Serializer):
    portfolio_id = serializers.IntegerField()

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

class UpdatePositionStockPricesSerializer(serializers.Serializer):
    brokerage = serializers.CharField()

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('uid', 'portfolio', 'stock', 'quantity', 'value', 'is_buy_type', 'date')

class BrokerageInputSerializer(serializers.Serializer):
    brokerage = serializers.CharField()