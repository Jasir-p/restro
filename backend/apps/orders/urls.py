from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MenuItemsManagementViews, 
    menu_avalabilty_change,
    OrdersManagementView,
    order_status_change,
    OrderItemsView
)


router = DefaultRouter()
router.register(r'menu-items', MenuItemsManagementViews, basename='menu-items')

urlpatterns = [
    path('', include(router.urls)),
    path('menu-items/<int:id>/change-status/', menu_avalabilty_change, 
         name='menu-item-status'),
    path('orders/', OrdersManagementView.as_view(), name="orders"),
    path('orders/<int:table_id>/', OrdersManagementView.as_view(), name="orders"),
    path('orders/<int:id>/change-status/', order_status_change, 
         name='order-status'),
    path('orders/<int:order_id>/order-items/', OrderItemsView.as_view(), name='order-items'),
    path('orders/<int:item_id>/update-items/', OrderItemsView.as_view(), name='order-items-update')

]
