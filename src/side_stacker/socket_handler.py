import asyncio
import json

from controller import PLAYER1, PLAYER2


class SocketHandler:
    async def handle_messages(self, websocket):
        for player, move in [
            (PLAYER1, "4R"),
            (PLAYER2, "4R"),
            (PLAYER1, "3R"),
            (PLAYER2, "3R"),
            (PLAYER1, "2R"),
            (PLAYER2, "1R"),
            (PLAYER1, "5R"),
        ]:
            event = {
                "type": "play",
                "player": player,
                "move": move,
            }
            await websocket.send(json.dumps(event))
            await asyncio.sleep(0.5)
        event = {
            "type": "win",
            "player": PLAYER1,
        }
        await websocket.send(json.dumps(event))
