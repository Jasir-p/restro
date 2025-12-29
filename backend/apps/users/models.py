from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class Worker(AbstractUser):

    phone = models.CharField(
        max_length=15,
        null=True,
        blank=True
    )

    @property
    def fullname(self):
        return "{self.first_name} {self.last_name}".strip()