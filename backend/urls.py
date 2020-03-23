from django.conf.urls import url
from .tdameritrade.apis import *
from .users.apis import *
from .bluedresscapital.apis import *
from .robinhood.apis import *

import inspect
import sys

def filter_apis(api):
    return (issubclass(api, generics.GenericAPIView) or
    issubclass(api, generics.RetrieveAPIView))

def get_imported_modules():
    return [m for _, m in inspect.getmembers(sys.modules[__name__], inspect.isclass)]

def get_urls():
    return [api for api in get_imported_modules() if filter_apis(api)]

urls = get_urls()
print(urls)
urlpatterns = [url("^{}$".format(api.url), api.as_view()) for api in get_urls()]