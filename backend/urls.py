from django.urls import path
from backend.apis import users
from django.conf.urls import include, url

urlpatterns = [
    url("^auth/register/$", users.RegistrationAPI.as_view()),
    url("^auth/login/$", users.LoginAPI.as_view()),
    url("^auth/user/$", users.UserAPI.as_view()),
]
