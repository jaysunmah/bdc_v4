# Generated by Django 3.0.4 on 2020-03-24 20:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0007_order'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='date',
            field=models.DateTimeField(),
        ),
    ]
