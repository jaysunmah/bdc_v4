from django.db import models
from django.contrib.auth.models import User

# Use brokerage to figure out which set of apis to use
class Brokerage(models.Model):
    name = models.CharField(max_length=100, primary_key=True)

    def is_tda(self):
        return self.name == "tda"

class Stock(models.Model):
    ticker = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=100)

class Portfolio(models.Model):
    # Assume one bdc_v4 user can have multiple portfolios
    bdc_user = models.ForeignKey(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=1000)
    brokerage = models.ForeignKey(Brokerage, on_delete=models.CASCADE)

    class Meta:
        # For now, assume each user can only have 1 portfolio of the same brokerage type
        # (i.e. can only have 1 td brokerage portfolio linked)
        constraints = [
            models.UniqueConstraint(fields=['bdc_user', 'brokerage'], name='bdc_user__brokerage__unique')
        ]

class Position(models.Model):
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    value = models.DecimalField(decimal_places=4, max_digits=10)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)

    class Meta:
        # For each portfolio, there should only be one position for each stock
        constraints = [
            models.UniqueConstraint(fields=['portfolio', 'stock'], name='portfolio__stock__unique')
        ]

