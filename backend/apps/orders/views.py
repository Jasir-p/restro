from django.shortcuts import render
from rest_framework import viewsets, views, permissions
from .serializers import MenuitemsSerializer
from .models import MenuItem
from .permissions import MenuItemPermission

# Create your views here.

class MenuItemsManagementViews(viewsets.ModelViewSet):

    serializer_class = MenuitemsSerializer
    queryset = MenuItem.objects.all()
    
    def get_permissions(self):

        if self.action == 'list':
            return [permissions.IsAuthenticated()]
        
        return [permissions.IsAuthenticated(), MenuItemPermission()]
        




