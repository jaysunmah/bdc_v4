from django.db import models
from django.contrib.auth.models import User

class TDUser(models.Model):
    bdc_user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    refresh_token = models.CharField(max_length=1000)
    access_token = models.CharField(max_length=1000)
    account_id = models.CharField(max_length=100)
