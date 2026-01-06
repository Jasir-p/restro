from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def table_status_handler(table_id, status):
    channel_layer = get_channel_layer()

    if channel_layer is not None:
        async_to_sync(channel_layer.group_send)(
            "tables_global",
            {
                "type": "table_status_change",
                "table_id": table_id,
                "status": status,
            }
            )
