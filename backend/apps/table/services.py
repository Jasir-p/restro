from .models import Table
from django.shortcuts import get_object_or_404

def get_tables():

    tables = Table.objects.all()
    return tables


def get_table_by_id(id):

    return get_object_or_404(Table, id=id)
