from django.urls import path
from .views import RegisterWorkersView, CustomeTokenObtainPairView, LogOutView, CustomeTokenRefreshView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('workers/register/', RegisterWorkersView.as_view(), 
         name="register-worker"),
    
    path('workers/sign-in/', CustomeTokenObtainPairView.as_view(),
         name="sign-in-worker"),

    path('token/refresh/', CustomeTokenRefreshView.as_view()),
    path('workers/logout/', LogOutView.as_view(), name='logout-worker')
]


