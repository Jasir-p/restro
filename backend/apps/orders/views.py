# from django.shortcuts import render
from rest_framework import viewsets, views, permissions, response, status, decorators

from django_filters.rest_framework import DjangoFilterBackend
from .filters import MenuItemFilter
from .serializers import (
    MenuitemsSerializer, 
    OrderSerializer, 
    OrderStatusSerializer, 
    ReadOrderSerializer, 
    ReadOrderItemSerializer,
    OrderItemSerializer)
from .models import MenuItem
from .permissions import ( 
    MenuItemPermission, 
    OrderPermissions
    )

from .serializers import MenuitemsSerializer, OrderSerializer, OrderStatusSerializer, ReadOrderSerializer
from .models import MenuItem
from .permissions import MenuItemPermission, OrderPermissions

from .services import (
    get_all_orders, 
    get_order_by_waiter, 
    order_get_by_id, 
    get_menu_item_by_id,
    get_order_items_by_order_id,
    get_single_order_item,
    get_order_by_table,
    get_menu_item_by_id)


# Create your views here.


class MenuItemsManagementViews(viewsets.ModelViewSet):

    serializer_class = MenuitemsSerializer
    queryset = MenuItem.objects.all()


    filter_backends = [DjangoFilterBackend]
    filterset_class = MenuItemFilter


    
    def get_permissions(self):

        if self.action == 'list':
            return [permissions.IsAuthenticated()]
        
        return [permissions.IsAuthenticated(), MenuItemPermission()]

@decorators.api_view(["POST"])
@decorators.permission_classes([permissions.IsAuthenticated])
def menu_avalabilty_change(request, id):
    user = request.user

    if user.has_perm("orders.change_menu_item"):

        menu_item = get_menu_item_by_id(id)

        menu_item.is_available = not menu_item.is_available
        menu_item.save()
        return response.Response(
            {"message": "successfully updated menu item"}, 
            status=status.HTTP_200_OK)
    
    return response.Response(
        {"error": "you dont have permission"},
        status=status.HTTP_403_FORBIDDEN)


class OrdersManagementView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, OrderPermissions]


    def get(self, request, table_id, *args, **kwargs):
        if not table_id:
            orders = get_all_orders() 
            serializer = ReadOrderSerializer(orders, many=True)
        else:
            orders = get_order_by_table(table_id)
            serializer = ReadOrderSerializer(orders)
        
        if not orders:
            return response.Response({"error": "No order Created"}, 
                                     status=status.HTTP_404_NOT_FOUND)

        serializer = ReadOrderSerializer(orders)


        return response.Response({'orders': serializer.data}, 
                                 status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):

        serializer = OrderSerializer(
            data=request.data, 
            context={"request": request}
            )
        
        if serializer.is_valid():
            serializer.save()
            return response.Response({"message": "Order created successfully"}, 
                                     status=status.HTTP_201_CREATED)
        
        return response.Response({"error": serializer.errors}, 
                                 status=status.HTTP_400_BAD_REQUEST)


VALID_TRANSITIONS = {
    "placed": ["in_kitchen"],
    "in_kitchen": ["served"],
}



@decorators.api_view(["PATCH"])
@decorators.permission_classes([permissions.IsAuthenticated])
def order_status_change(request, id):
    user = request.user

    if user.has_perm("orders.change_order"):
        serializer = OrderStatusSerializer(data=request.data)

        if serializer.is_valid():
            order = order_get_by_id(id)

            status_new = serializer.validated_data["status"]

            if status_new not in VALID_TRANSITIONS.get(order.status, []):
                return response.Response({
                    "error": "Invalid status Change"},
                    status=status.HTTP_400_BAD_REQUEST
                    
                )
            
            order.status = status_new
            order.save()
            return response.Response(
             {"message": "Order status updated successfully"},
             status=status.HTTP_200_OK
            )
        
        return response.Response(
            {"error": "invalid status"}, 
            status=status.HTTP_400_BAD_REQUEST)

    return response.Response(
        {"error": "You dont have permission"},
        status=status.HTTP_403_FORBIDDEN
    )


class OrderItemsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, OrderPermissions]
    
    def get(self, request, order_id):
        
        order_items = get_order_items_by_order_id(order_id)

        serializer = ReadOrderItemSerializer(order_items, many=True)

        return response.Response(
            {"order_items": serializer.data}, 
            status=status.HTTP_200_OK)
    
    def patch(self, request, item_id):

        order_item = get_single_order_item(item_id)

        if order_item.order.status == 'served':
            return response.Response(
                {"error": " You cant update this order"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = OrderItemSerializer(
            order_item,
            data=request.data,
            partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return response.Response(
                {"message": "successfully updated"},
                status=status.HTTP_200_OK
                )
        return response.Response(
            {"error": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
            )
    








