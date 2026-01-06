# from django.shortcuts import render
from .serializers import (
     WorkerSerializers, 
     CustomTokenObtainPairSerializer
)
from rest_framework import views, response, permissions, status
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomTokenRefreshSerializer


# Create your views here.

class RegisterWorkersView(views.APIView):

    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):

        serializer = WorkerSerializers(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return response.Response({"message": "Added successfully"},
                                     status=status.HTTP_201_CREATED)
        
        return response.Response({"error": serializer.errors},
                                 status=status.HTTP_400_BAD_REQUEST)


class CustomeTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer  


class CustomeTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer

class LogOutView(views.APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return response.Response(
                {"message": "Logout successful"},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception:
            return response.Response(
                {"error": "Invalid token"},
                status=status.HTTP_400_BAD_REQUEST
            )