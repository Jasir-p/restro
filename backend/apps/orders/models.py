from django.db import models

# Create your models here.


class MenuItem(models.Model):

    CATEGORY_CHOICES = [
        ("starter", "Starter"),
        ("main", "Main"),
        ("drinks", "Drinks"),
        ("dessert", "Dessert"),
    ]

    name = models.CharField(max_length=40, unique=True)
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES
            )
    price = models.DecimalField(max_digits=8, decimal_places=2)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    

class Order(models.Model):

    STATUS_CHOICES = [
        ('placed', 'Placed'),
        ('in_kitchen', 'In Kitchen'),
        ('served', 'Served')
    ]

    order_id = models.CharField(max_length=10, unique=True)
    worker = models.ForeignKey("users.Worker", on_delete=models.CASCADE)
    table = models.ForeignKey("table.Table", on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='placed'
        )
    
    @property
    def total_amount(self):
        return sum(item.total_amount for item in self.items.all())


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order, 
        on_delete=models.CASCADE,
        related_name="items"
        )
    menu_item = models.ForeignKey(
        MenuItem, 
        on_delete=models.CASCADE,

        )
    
    quantity = models.PositiveIntegerField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    @property
    def total_amount(self):
        return self.price * self.quantity
    
