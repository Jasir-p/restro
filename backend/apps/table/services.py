from .models import Table


def get_tables():

    tables = Table.objects.all()
    return tables


def get_table_by_id(id):

    table = Table.objects.get(id=id)

    return table
