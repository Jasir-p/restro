from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from apps.orders.models import Order
from apps.bills.models import Bills
from apps.table.models import Table
from apps.orders.models import MenuItem
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()

class Command(BaseCommand):
    help = "Seed initial data for the project"

    def handle(self, *args, **kwargs):
        self.create_groups_and_permissions()
        self.create_users()
        self.create_tables()
        self.create_menu_items()
        
        self.assign_users_to_groups()
        self.stdout.write(self.style.SUCCESS("Seed data created successfully"))

    def create_users(self):
        users = [
            {"username": "manager", "password": "manager123", "role": "manager"},
            {"username": "waiter", "password": "waiter123", "role": "waiter"},
            {"username": "cashier", "password": "cashier123", "role": "cashier"},
        ]

        for u in users:
            user, created = User.objects.get_or_create(
                username=u["username"],
            )
            if created:
                user.set_password(u["password"])
                user.save()

    def create_tables(self):
        for i in range(1, 6):
            Table.objects.get_or_create(
                table_number=i,
                defaults={"capacity": 4, "status": "available"}
            )

    def create_menu_items(self):
        items = [
            ("Soup", "starter", 120),
            ("Chicken Biriyani", "main", 220),
            ("Lime Juice", "drinks", 60),
            ("Ice Cream", "dessert", 80),
        ]

        for name, category, price in items:
            MenuItem.objects.get_or_create(
                name=name,
                defaults={
                    "category": category,
                    "price": price,
                    "is_available": True,
                }
            )

    def create_groups_and_permissions(self):
        waiter_group, _ = Group.objects.get_or_create(name="Waiter")
        cashier_group, _ = Group.objects.get_or_create(name="Cashier")
        manager_group, _ = Group.objects.get_or_create(name="Manager")

        order_ct = ContentType.objects.get_for_model(Order)
        bills_ct = ContentType.objects.get_for_model(Bills)
        table_ct = ContentType.objects.get_for_model(Table)
        request_bill_perm = Permission.objects.get(
            content_type=table_ct,
            codename="request_bill"
        )

        waiter_perms = Permission.objects.filter(
            content_type=order_ct,
            codename__in=["add_order", "change_order"]
        )

        cashier_perms = Permission.objects.filter(
            content_type=bills_ct,
            codename__in=["add_bills", "change_bills"]
        )

        manager_perms = Permission.objects.all()

        waiter_group.permissions.set(waiter_perms)
        waiter_group.permissions.add(request_bill_perm)

        cashier_group.permissions.set(cashier_perms)
        manager_group.permissions.set(manager_perms)


    def assign_users_to_groups(self):
        user_group_map = {
            "waiter": "Waiter",
            "cashier": "Cashier",
            "manager": "Manager",
        }

        for username, group_name in user_group_map.items():
            group = Group.objects.get(name=group_name)
            user = User.objects.get(username=username)

            user.groups.add(group)

    