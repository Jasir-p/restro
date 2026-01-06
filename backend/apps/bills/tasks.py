from celery import shared_task
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Bills
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def bill_alerts_to_manager():

    time_check = timezone.now() - timedelta(minutes=30)

    bills = Bills.objects.filter(
        status="pending",
        is_sent_alert=False
    )


    for bill in bills:
        send_mail(
            subject="Pending Bill ......",
            message=f"Bill for Table {bill.table.table_number} is pending too long.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.MANAGER_EMAIL],
            fail_silently=False,
        )
        bill.is_sent_alert = True
        bill.save()
