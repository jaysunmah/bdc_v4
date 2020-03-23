from django.db import models
from django.contrib.auth.models import User
from backend.bluedresscapital.models import Stock

class RHAccount(models.Model):
    bdc_user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    username = models.CharField(max_length=1000)
    password = models.CharField(max_length=1000)
    qr_code = models.CharField(max_length=100)

class Instrument(models.Model):
    stock = models.OneToOneField(Stock, on_delete=models.CASCADE, primary_key=True)
    instrument_id = models.CharField(max_length=100)
