from rest_framework import serializers
from .models import Bills
from apps.orders.serializers import ReadOrderSerializer
from decimal import Decimal


class BillSerializer(serializers.ModelSerializer):

    class Meta:
        model = Bills
        fields = ['table', 'order']

    def validate(self, attrs):
        table = attrs.get("table")
        order = attrs.get("order")

        if order is None:
            raise serializers.ValidationError(
                "Please select Order"
            )
        
        if not table:
            raise serializers.ValidationError(
                "Table not found"
            )
    
        bill = Bills.objects.filter(order__id=order.id)

        if self.instance:
            bill = bill.exclude(id=self.instance.id)

        if bill.exists():
            raise serializers.ValidationError(
                "Bill already generated for this order"
            )
        
        # order-table mismatch check

        if order.table.id != table.id:

            raise serializers.ValidationError(
                "Selected order does not belong to this table"
            )

        return attrs
    
    def create(self, validated_data):
        order = validated_data['order']
        table = validated_data['table']

        sub_total = order.total_amount
        tax_percentage = Decimal("5.0")

        tax_amount = (sub_total * tax_percentage) / Decimal("100")
        total_amount = tax_amount + sub_total

        bill = Bills.objects.create(
            table=table,
            order=order,
            subtotal=sub_total,
            tax_amount=tax_amount,
            total_amount=total_amount
        )

        return bill
        
        
class ReadBillSerializer(serializers.ModelSerializer):

    order = ReadOrderSerializer()

    table_number = serializers.CharField(
        source="table.table_number",
        read_only=True
    )

    class Meta:
        model = Bills
        fields = [
            "id",
            "table",
            "order",          
            "table_number",   
            "subtotal",
            "tax_amount",
            "total_amount",
            "status",
            "created_at",
        ]


class StatusCheckSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=Bills.STATUS_CHOICE
    )

