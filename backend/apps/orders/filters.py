from django_filters import rest_framework as filters
from django.db import models
from .models import MenuItem


class MenuItemFilter(filters.FilterSet):
    category = filters.ChoiceFilter(choices=MenuItem.CATEGORY_CHOICES)

    class Meta:
        model = MenuItem
        fields = ['category']
