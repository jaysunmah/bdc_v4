# Generated by Django 3.0.4 on 2020-03-28 04:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0008_auto_20200324_2016'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transfer',
            fields=[
                ('uid', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('amount', models.DecimalField(decimal_places=4, max_digits=10)),
                ('is_deposit_type', models.BooleanField()),
                ('date', models.DateField()),
                ('portfolio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.Portfolio')),
            ],
        ),
    ]
