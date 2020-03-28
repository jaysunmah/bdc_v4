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
        fields = ('uid', 'portfolio', 'stock', 'quantity', 'value', 'is_buy_type', 'manually_added', 'date')

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

class ManualDeleteByUidSerializer(serializers.Serializer):
    uid = serializers.CharField()
    def validate_uid(self, value):
        if "manual_" not in value:
            raise serializers.ValidationError("Cannot delete this uid because it doesn't seem to be manually added: " + value)
        return value

class TransferManualEditSerializer(serializers.Serializer):
    uid = serializers.CharField()
    date = serializers.DateField()
    action = serializers.CharField()
    amount = serializers.DecimalField(10, 4)

    def validate_action(self, value):
        if value != "WITHDRAW" and value != "DEPOSIT":
            raise serializers.ValidationError("Invalid action: " + value)
        return value

    def validate_uid(self, value):
        if "manual_" not in value:
            raise serializers.ValidationError("Cannot edit this uid because it doesn't seem to be manually added: " + value)
        return value

class BrokerageInputSerializer(serializers.Serializer):
    brokerage = serializers.CharField()

class OrderManualSaveSerializer(serializers.Serializer):
    brokerage = serializers.CharField()
    action= serializers.CharField()
    stock = serializers.CharField()
    quantity = serializers.DecimalField(10, 4)
    price = serializers.DecimalField(10, 4)
    date = serializers.DateField()

    def validate_stock(self, value):
        if value.upper() != value:
            raise serializers.ValidationError("Stock ticker must be in all caps")
        if len(value) > 5:
            raise serializers.ValidationError("Stock ticker can be at most length 5")
        return value

    def validate_action(self, value):
        if value != "BUY" and value != "SELL":
            raise serializers.ValidationError("Action is invalid. Can only be 'BUY' or 'SELL'")
        return value

class OrderManualEditSerializer(serializers.Serializer):
    uid = serializers.CharField()
    action = serializers.CharField()
    stock = serializers.CharField()
    quantity = serializers.DecimalField(10, 4)
    price = serializers.DecimalField(10, 4)
    date = serializers.DateField()

    def validate_uid(self, value):
        if "manual_" not in value:
            raise serializers.ValidationError("Cannot edit this uid because it doesn't seem to be manually added: " + value)
        return value

    def validate_stock(self, value):
        if value.upper() != value:
            raise serializers.ValidationError("Stock ticker must be in all caps")
        if len(value) > 5:
            raise serializers.ValidationError("Stock ticker can be at most length 5")
        return value

    def validate_action(self, value):
        if value != "BUY" and value != "SELL":
            raise serializers.ValidationError("Action is invalid. Can only be 'BUY' or 'SELL'")
        return value