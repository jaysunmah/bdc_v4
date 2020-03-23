from backend.bluedresscapital import Stock, Position
from backend.robinhood.rhscraper import get_stock_from_symbol


def upsert_position(positionObj, portfolio):
    """
    Given a position dict, will upsert the current position. The update should simply update
    the quantity and value fields. portfolio and stock foreign key will remain the same.

    :param positionObj:  position dict. Should have `symbol`, `quantity`, and `value` keys
    :param portfolio:  Portfolio model object
    :return: None
    """
    try:
        stock = Stock.objects.get(ticker=positionObj['symbol'])
    except Stock.DoesNotExist:
        stock = Stock(ticker=positionObj['symbol'], name=get_stock_from_symbol(positionObj['symbol']))
        stock.save()

    try:
        position = Position.objects.get(portfolio=portfolio, stock=stock)
        position.quantity = positionObj['quantity']
        position.value = positionObj['value']
    except Position.DoesNotExist:
        position = Position(portfolio=portfolio, quantity=positionObj['quantity'], value=positionObj['value'],
                            stock=stock)
    position.save()