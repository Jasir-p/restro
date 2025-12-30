from rest_framework import serializers
from .models import MenuItem


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
        fields = ['id', 'name', 'category', 'price']

    def validate_name(self, value):
        name = value.strip()
        if len(name) < 2:
            raise serializers.ValidationError(
                'Title must be at least 3 characters long')
        
        items = MenuItem.objects.filter(name__iexact=name)
        print(items)
        
        if self.instance:
            items = items.exclude(id=self.instance.id)

        if items.exists():
            raise serializers.ValidationError(
                "Menu item with this name already exists."
            )
        
        return value
    


        





