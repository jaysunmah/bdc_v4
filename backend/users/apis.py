from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from .serializers import CreateUserSerializer, UserSerializer, LoginUserSerializer
from knox.models import AuthToken

class RegistrationAPI(generics.GenericAPIView):
    url = "auth/register/"
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        _, token = AuthToken.objects.create(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token
        })

class LoginAPI(generics.GenericAPIView):
    url = "auth/login/"
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        _, token = AuthToken.objects.create(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token
        })

class UserAPI(generics.RetrieveAPIView):
    url = "auth/user/"
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
