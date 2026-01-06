from django.db import models

# Create your models here.


class Table(models.Model):
    STATUS_CHOICE = [
        ('available', 'Available'),
        ('occupied', 'Occupied'),
        ('bill_requested', 'Bill Requested'),
        ('closed', 'Closed')
    ]
    table_number = models.CharField(max_length=10, unique=True)
    capacity = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICE,
                              default='available')

    class Meta:
        permissions = [
            ("request_bill", "request bill"),
           
        ]

