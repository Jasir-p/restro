from rest_framework import serializers
from .models import MenuItem, OrderItem, Order
from  apps.table.utils import table_status_handler
from  apps.table.serializers import ReadTableSerializer


class MenuitemsSerializer(serializers.ModelSerializer):

    price = serializers.DecimalField(
        max_digits=8,
        decimal_places=2,
        min_value=1,
        error_messages={
            "error": " price must be atleast 1"
        }

    )

    category = serializers.ChoiceField(
        choices=MenuItem.CATEGORY_CHOICES,
        error_messages={
         "invalid choice": "Category must be Starter, Main, Drinks, or Dessert"
        }
    )

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'category', 'price', 'is_available']

    def validate_name(self, value):
        name = value.strip()
        if len(name) < 2:
            raise serializers.ValidationError(
                'Title must be at least 3 characters long')
        
        items = MenuItem.objects.filter(name__iexact=name)
        
        if self.instance:
            items = items.exclude(id=self.instance.id)

        if items.exists():
            raise serializers.ValidationError(
                "Menu item with this name already exists."
            )
        
        return value


class ReadMenuIteMSrializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'category', 'price', 'is_available']


class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem

        fields = ['menu_item', 'quantity']
    
    def validate_menu_item(self, value):

        if not value.is_available:
            raise serializers.ValidationError(
                "This item is currently unavailable"
            )
        
        return value


class ReadOrderItemSerializer(serializers.ModelSerializer):

    menu_item = ReadMenuIteMSrializer()

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ["id", "table", "items", "status", "created_at"]
        read_only_fields = ["status", "created_at"]

    def validate_table(self, value):

        if value.status != 'available':

            raise serializers.ValidationError(
                 "This table already has an active order."
            )
        return value
        
    def create(self, validated_data):
        items = validated_data.pop("items")
        user = self.context["request"].user

        # create order
        order = Order.objects.create(

            worker=user,
            status="placed",
            table=validated_data['table'],
        )

        # create order items

        for item in items:
            menu_item = item["menu_item"]

            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=item['quantity'],
                price=menu_item.price
            )

        table = order.table
        table.status = "occupied"
        table.save()
        table_status_handler(table.id, table.status)
        return order


class ReadOrderSerializer(serializers.ModelSerializer):
    table = ReadTableSerializer()
    items = ReadOrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'table', 'order_number',
                  'status', 'total_amount', 'created_at',
                  'items']


class OrderStatusSerializer(serializers.Serializer):

    status = serializers.ChoiceField(
        choices=Order.STATUS_CHOICES
    )





