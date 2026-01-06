from django.urls import path
from .views import TableManagementView,table_status_change


urlpatterns = [
    path('tables/', TableManagementView.as_view(), name='table-list-create'),
    path('tables/<int:id>/', TableManagementView.as_view(), name="table-detail"),
    path('tables/<int:id>/status/', table_status_change, name='table-status-change')

]