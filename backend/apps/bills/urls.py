from django.urls import path
from .views import (
    BillGenarateView,
    BillRetriveView,
    BillRetriveToday, 
    SingleBillRetrieve,
    bill_status_change,
    request_bill
)


urlpatterns = [
    path('billing/create/', BillGenarateView.as_view(), name="billing-create"),
    path('billing/lists/', BillRetriveView.as_view(), name="billing-lists"),
    path('billing/lists/today/', BillRetriveToday.as_view(), name="billing-lists-today"),
    path('billing/detail/<int:id>/', SingleBillRetrieve.as_view(), name='billing-detail'),
    path('billing/<int:id>/status/', bill_status_change, name='bill-status'),
    path('billing/request/<int:table_id>/', request_bill, name="request-bill")
]
