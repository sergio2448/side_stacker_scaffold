import json
import secrets

from constants import PLAYER1, PLAYER2
from controller import GameController
from repository import GameRepository


class SocketHandler:
    GAME = dict()

    async def send_error(self, websocket, message):
        event = {
            "type": "error",
            "message": message,
        }
        await websocket.send(json.dumps(event))

    async def replay(self, websocket, controller):
        """
        Sends all moves for a player joining the match with some several played turns
        """
        for player, movement in controller.moves.copy():
            event = {"type": "play", "player": player, "movement": movement}
            await websocket.send(json.dumps(event))

    async def play(self, websocket, player: int, movement: str, controller: GameController, connections: set):
        try:
            # Play the move.
            controller.play(player, movement)
        except (RuntimeError, AssertionError) as exc:
            # Send an "error" event if the move was illegal.
            await self.send_error(websocket, str(exc))
            return

        # Send a "play" event to update the UI.
        event = {"type": "play", "player": player, "movement": movement}
        for connection in connections:
            await connection.send(json.dumps(event))

        # If move is winning, send a "win" event.
        if controller.winner is not None:
            event = {
                "type": "win",
                "player": controller.winner,
            }
            for connection in connections:
                await connection.send(json.dumps(event))

    async def init(self, websocket):
        repo = GameRepository()
        controller = GameController(repo)
        connections = {websocket}

        join_key = secrets.token_urlsafe(12)
        self.GAME[join_key] = controller, connections

        try:
            # Send the secret access token to the browser of the first player,
            # where it'll be used for building a "join" link.
            event = {
                "type": "init",
                "join": join_key,
            }
            await websocket.send(json.dumps(event))

            while True:
                message = await websocket.recv()
                event = json.loads(message)
                movement = event["movement"]
                await self.play(websocket, PLAYER1, movement, controller, connections)
        finally:
            del self.GAME[join_key]

    async def join(self, websocket, join_key: str):
        try:
            controller, connections = self.GAME[join_key]
        except KeyError:
            await self.send_error(websocket, "Game not found")
            return

        # Register to receive moves from this game.
        connections.add(websocket)
        try:
            await self.replay(websocket, controller)
            while True:
                message = await websocket.recv()
                event = json.loads(message)
                movement = event["movement"]
                await self.play(websocket, PLAYER2, movement, controller, connections)
        finally:
            connections.remove(websocket)

    async def handle_messages(self, websocket):
        message = await websocket.recv()
        event = json.loads(message)
        event_type = event["type"]

        if event_type == "init":
            await self.init(websocket)
        else:
            join_key = event["join_key"]
            await self.join(websocket, join_key)
