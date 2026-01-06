from django.db import models

# Create your models here.


class Bills(models.Model):

    STATUS_CHOICE = [
        ("not_generated", "Not Generated"),
        ("pending", "Pending Payment"),
        ("paid", "Paid"),
    ]

    table = models.ForeignKey(
        'table.Table',
        on_delete=models.PROTECT,
        related_name='bill'
    )

    order = models.OneToOneField(
        'orders.Order',
        on_delete=models.PROTECT,
        related_name='bill'
    )
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=3
        )
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICE,
        default='pending'
    )
    is_sent_alert = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def bill_id(self):
        return f"Bill #{self.id} -Table {self.table.table_number}"
