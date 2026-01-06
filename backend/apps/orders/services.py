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


def get_order_items_by_order_id(order_id):
    return get_object_or_404(Order, id=order_id).items.all()


def get_single_order_item(item_id):
    return get_object_or_404(OrderItem, id=item_id)


def get_order_by_table(table_id):
    return (
        Order.objects
        .filter(
            table_id=table_id,
            status__in=["placed", "in_kitchen", "served"]
        )
        .order_by("-created_at")
        .first()
    )

    return get_object_or_404(Order, id=id)

