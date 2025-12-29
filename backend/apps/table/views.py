from django.shortcuts import render
from rest_framework import views, status, permissions, response
from .serializers import TableManagementSerializer
from .services import get_tables, get_table_by_id
from .permissions import TablePermissions
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
        
        table.delete()

        return response.Response({"message": "Removed successfully"}, 
                                 status=status.HTTP_200_OK)



