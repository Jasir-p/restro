from .models import Order, OrderItem, MenuItem
from django.shortcuts import get_object_or_404


def get_menu_item_by_id(id):
    return get_object_or_404(MenuItem, id=id)


def get_all_orders():

    return Order.objects.all()


def get_order_by_waiter(user):

    return Order.objects.filter(worker=user)


def order_get_by_id(id):

    return get_object_or_404(Order, id=id)