import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TableStatusUpdateConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.group_name = "tables_global"

        print(f"connecting...")
        await self.accept()
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        

    
    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def table_status_change(self, event):
        await self.send(text_data=json.dumps({
            "table_id": event["table_id"],
            "status": event["status"]
        }))
