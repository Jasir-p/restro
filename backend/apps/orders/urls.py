from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MenuItemsManagementViews


router = DefaultRouter()
router.register(r'menu-items', MenuItemsManagementViews, basename='menu-items')

urlpatterns = [
    path('', include(router.urls))
]
