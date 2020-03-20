from rest_framework import serializers


class HelloWorldSerializer(serializers.Serializer):
    num = serializers.IntegerField()
