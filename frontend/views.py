from django.shortcuts import render

# Create your views here.
def index(request):
    print("WEI")
    return render(request, 'frontend/index.html')
