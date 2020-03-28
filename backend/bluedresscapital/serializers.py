from rest_framework import serializers
from .models import Portfolio, Position, Stock, StockQuote, Order, Transfer

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

class TransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transfer
        fields = ('uid', 'portfolio', 'amount', 'is_deposit_type', 'manually_added', 'date')

class TransferManualSaveSerializer(serializers.Serializer):
    brokerage = serializers.CharField()
    date = serializers.DateField()
    action = serializers.CharField()
    amount = serializers.DecimalField(10, 4)

    def validate_action(self, value):
        if value != "WITHDRAW" and value != "DEPOSIT":
            raise serializers.ValidationError("Invalid action: " + value)
        return value


class BrokerageInputSerializer(serializers.Serializer):
    brokerage = serializers.CharField()