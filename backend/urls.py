from django.conf.urls import url
from .tdameritrade.apis import urls as td_urls
from .users.apis import urls as user_urls

urls = user_urls + td_urls

urlpatterns = [url("^{}$".format(endpoint), api.as_view()) for (endpoint, api) in urls]