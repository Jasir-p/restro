from django.urls import path
from .views import TableManagementView


urlpatterns = [
    path('tables/', TableManagementView.as_view(), name='table-list-create'),
    path('tables/<int:id>/', TableManagementView.as_view(), name="table-detail")

]