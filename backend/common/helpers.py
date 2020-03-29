from decimal import Decimal

from rest_framework.response import Response

from backend.bluedresscapital import Stock, Position, Portfolio, Order, StockQuote
from backend.bluedresscapital.serializers import PositionSerializer
from backend.robinhood.rhscraper import get_stock_from_symbol

def upsert_positions(portfolio: Portfolio) -> Response:
    orders = Order.objects.filter(portfolio=portfolio)
    stock_positions = {}
    for order in orders:
        ticker = order.stock.ticker
        if ticker not in stock_positions:
            stock_positions[ticker] = 0
        if order.is_buy_type:
            stock_positions[ticker] += order.quantity
        else:
            stock_positions[ticker] -= order.quantity

    stock_values = {}
    for ticker in stock_positions:
        if stock_positions[ticker] != 0:
            stock, _ = Stock.objects.get_or_create(ticker=ticker, defaults={"name": get_stock_from_symbol(ticker)})
            stock_quote = StockQuote.objects.filter(stock=stock).order_by('-date').first()
            if stock_quote is not None:
                stock_value = stock_quote.price
            else:
                stock_value = -1 # TODO!!!!
        else:
            stock_value = 0
        stock_values[ticker] = stock_value

    def get_position(s):
        return Position(
            portfolio=portfolio,
            quantity=Decimal(stock_positions[s]),
            value=Decimal(stock_positions[s]) * Decimal(stock_values[s]),
            stock=Stock.objects.get(ticker=s)
        )

    positions = [get_position(s) for s in stock_positions]
    # TODO - we can probably optimize this somehow with a bulk upsert - not sure if
    # django has an ORM feature for this yet
    for position in positions:
        Position.objects.update_or_create(portfolio=position.portfolio, stock=position.stock, defaults={ 'value': position.value, 'quantity': position.quantity })
    return Response(PositionSerializer(positions, many=True).data)