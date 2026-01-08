from django.shortcuts import render
from rest_framework import views, permissions, decorators, generics,response,status
from .serializers import BillSerializer, ReadBillSerializer,StatusCheckSerializer
from .permissions import BillPermissions
from .models import Bills
from django.utils.timezone import localdate
from django.shortcuts import get_object_or_404
from apps.table.utils import table_status_handler
from apps.orders.services import get_order_by_table
from apps.table.services import get_table_by_id

# Create your views here.


class BillGenarateView(generics.CreateAPIView):
    serializer_class = BillSerializer
    permission_classes = [permissions.IsAuthenticated, BillPermissions]


class BillRetriveView(generics.ListAPIView):
    queryset = Bills.objects.all()
    serializer_class = ReadBillSerializer
    permission_classes = [permissions.IsAuthenticated]
    

class BillRetriveToday(generics.ListAPIView):
    serializer_class = ReadBillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bills.objects.filter(
                created_at__date=localdate()
            ).order_by("-created_at")


class SingleBillRetrieve(generics.RetrieveAPIView):
    serializer_class = ReadBillSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "id"

    def get_queryset(self):
        return Bills.objects.all()


BILL_STATUS_TRANSITIONS = {
    "not_generated": ["pending"],
    "pending": ["paid"],
    "paid": [],
        }


@decorators.api_view(["PATCH"])
@decorators.permission_classes([permissions.IsAuthenticated])
def bill_status_change(request,id):



    if not request.user.has_perm("bills.change_bills"):
        return response.Response(
            {"error": "You dont have permission"},
            status=status.HTTP_403_FORBIDDEN
        )
    serializer = StatusCheckSerializer(data=request.data)
    if not serializer.is_valid():
        return response.Response(
            {"error": "Invalid bill status "},
            status=404
        )
    bill = get_object_or_404(Bills, id=id)
    status_new = serializer.validated_data["status"]
    if status_new not in BILL_STATUS_TRANSITIONS.get(bill.status, []):
        return response.Response(
            {"error": "Invalid bill status transition"},
            status=400
        )

    bill.status = status_new
    bill.save()

    if bill.status == 'paid':
        table = bill.table
        table.status = "available"
        table.save()
        table_status_handler(bill.table.id, bill.table.status)

    return response.Response({"message": "successfully updated"}, 
                             status=status.HTTP_200_OK)


@decorators.api_view(["POST"])
@decorators.permission_classes([permissions.IsAuthenticated])
def request_bill(request, table_id):

    table = get_table_by_id(table_id)

    order = get_order_by_table(table_id)

    if not order or order.status != "served":
        return response.Response(
            {"error": "Cannot request bill before order is served"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if table.status == "bill_requested":
        return response.Response(
            {"message": "Bill already requested"},
            status=status.HTTP_200_OK
        )

    table.status = "bill_requested"
    table.save()
    table_status_handler(table.id, table.status)

    return response.Response(
        {"message": "Bill requested successfully"},
        status=status.HTTP_200_OK
    )