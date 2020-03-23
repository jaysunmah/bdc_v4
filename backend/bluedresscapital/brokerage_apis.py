from rest_framework.response import Response

from .models import Brokerage

def get_brokerage(brokerage):
    try:
        return Brokerage.objects.get(name=brokerage)
    except Brokerage.DoesNotExist:
        return Response({'error': 'Brokerage %s does not exist' % brokerage})
