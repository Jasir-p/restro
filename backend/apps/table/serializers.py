from .models import Table
from rest_framework import serializers, validators


class TableManagementSerializer(serializers.ModelSerializer):

    table_number = serializers.CharField(
        max_length=10,
        validators=[
            validators.UniqueValidator(
                queryset=Table.objects.all(),
                message="The Table number with table already exisit")
        ]
    )

    capacity = serializers.IntegerField(
        min_value=1,
        error_messages={
           "min_value": "Capacity must be at least 1."
        }
        
    )

    status = serializers.ChoiceField(
        choices=Table.STATUS_CHOICE,
        default='available'
    )

    class Meta:
        model = Table
        fields = ['id', 'table_number', 'capacity', 'status']


class ReadTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['id', 'table_number', 'capacity', 'status']
        

class TableStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=Table.STATUS_CHOICE,
    )

