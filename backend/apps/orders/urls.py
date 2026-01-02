from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MenuItemsManagementViews, 
    menu_avalabilty_change,
    OrdersManagementView,
    order_status_change
)


router = DefaultRouter()
router.register(r'menu-items', MenuItemsManagementViews, basename='menu-items')

urlpatterns = [
    path('', include(router.urls)),
    path('menu-items/<int:id>/change-status/', menu_avalabilty_change, 
         name='menu-item-status'),
    path('orders/', OrdersManagementView.as_view(), name="orders"),
    path('orders/<int:id>/change-status/', order_status_change, 
         name='order-status')

]
