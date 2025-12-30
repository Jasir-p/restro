from django.db import models

# Create your models here.


class MenuItem(models.Model):

    CATEGORY_CHOICES = [
        ("starter", "Starter"),
        ("main", "Main"),
        ("drinks", "Drinks"),
        ("dessert", "Dessert"),
    ]

    name = models.CharField(max_length=40, unique=True, null=False)
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES
            )
    price = models.DecimalField(max_digits=8, decimal_places=2)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name