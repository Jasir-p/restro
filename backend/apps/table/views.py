# from django.shortcuts import render
from rest_framework import views, status, permissions, response, decorators
from .serializers import TableManagementSerializer, TableStatusSerializer
from .services import get_tables, get_table_by_id
from .permissions import TablePermissions
from .utils import table_status_handler
# Create your views here.


class TableManagementView(views.APIView):
    permission_classes = [permissions.AllowAny, TablePermissions]

    def get(self, request):

        tables = get_tables()
        seralizer = TableManagementSerializer(tables, many=True)
        return response.Response(seralizer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):

        serializer = TableManagementSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return response.Response(status=status.HTTP_201_CREATED)
        
        return response.Response({"error": serializer.errors},
                                 status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, id):
        table = get_table_by_id(id)
        serializer = TableManagementSerializer(
            table,
            data=request.data,
            partial=True
            )
        
        if serializer.is_valid():
            serializer.save()
            return response.Response({"message": "Successfully updated"},
                                     status=status.HTTP_200_OK)
        
        return response.Response({"error": serializer.errors}, 
                                 status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):

        table = get_table_by_id(id)

        if not table:
            return response.Response({"error": "Item not found"}, 
                                     status=status.HTTP_404_NOT_FOUND)
        
        if table.status != 'available':
            return response.Response({"error": " Table is Occupied"},
                                     status=status.HTTP_400_BAD_REQUEST)
        table.delete()

        return response.Response({"message": "Removed successfully"}, 
                                 status=status.HTTP_200_OK)


VALID_TABLE_STATUS_TRANSITIONS = {
    "available": ["occupied","closed"],
    "occupied": ["bill_requested"],
    "bill_requested": ["available"],
    "closed": ["available"],
}


@decorators.api_view(["PATCH"])
@decorators.permission_classes([permissions.IsAuthenticated])
def table_status_change(request, id):
    if not request.user.has_perm('table.change_table'):
        return response.Response(
            {"error": "You dont have permission for this action"},
            status=status.HTTP_403_FORBIDDEN)
    
    serializer = TableStatusSerializer(data=request.data)
    if not serializer.is_valid():
        return response.Response({"error": serializer.errors}, 
                                 status=status.HTTP_400_BAD_REQUEST)
    
    table = get_table_by_id(id)
    status_new = serializer.validated_data["status"]
    
    if status_new not in VALID_TABLE_STATUS_TRANSITIONS.get(table.status,[]):
        return response.Response({
                    "error": "Invalid status Change"},
                    status=status.HTTP_400_BAD_REQUEST
                    
                )

    table.status = status_new
    table.save()
    table_status_handler(table.id, table.status)

    return response.Response(
        {"message": "successfully updated"},
        status=status.HTTP_200_OK
          )








