from rest_framework import serializers


class PortfolioSerializer(serializers.Serializer):
    num = serializers.IntegerField()