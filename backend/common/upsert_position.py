from backend.bluedresscapital import Stock, Position


def upsert_position(positionObj, portfolio):
    try:
        stock = Stock.objects.get(ticker=positionObj['symbol'])
    except Stock.DoesNotExist:
        stock = Stock(ticker=positionObj['symbol'], name='')
        stock.save()

    try:
        position = Position.objects.get(portfolio=portfolio, stock=stock)
        position.quantity = positionObj['quantity']
        position.value = positionObj['value']
    except Position.DoesNotExist:
        position = Position(portfolio=portfolio, quantity=positionObj['quantity'], value=positionObj['value'],
                            stock=stock)
    position.save()