from django.urls import path
from django.conf.urls import include, url
from .apis import users
from .tdameritrade.apis import tdameritrade_url_patterns

urlpatterns = [
    url("^auth/register/$", users.RegistrationAPI.as_view()),
    url("^auth/login/$", users.LoginAPI.as_view()),
    url("^auth/user/$", users.UserAPI.as_view()),
] + tdameritrade_url_patterns
