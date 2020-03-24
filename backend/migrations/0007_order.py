# Generated by Django 3.0.4 on 2020-03-24 06:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0006_auto_20200323_2142'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('uid', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('quantity', models.DecimalField(decimal_places=4, max_digits=10)),
                ('value', models.DecimalField(decimal_places=4, max_digits=10)),
                ('is_buy_type', models.BooleanField()),
                ('date', models.DateField()),
                ('portfolio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Portfolio')),
                ('stock', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Stock')),
            ],
        ),
    ]