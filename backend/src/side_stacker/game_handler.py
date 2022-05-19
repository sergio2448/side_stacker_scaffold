import json

from src.side_stacker.controller import GameController
from src.side_stacker.repositories import GameRepository


class GameHandler:
    CONNECTIONS = dict()
    PLAYER_COLORS = ["red", "yellow"]

    def __init__(self):
        self.game_repo = GameRepository()

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
            player_color = self.PLAYER_COLORS[controller.players.index(player)]
            event = {"type": "play", "player": player, "player_color": player_color, "movement": movement}
            await websocket.send(json.dumps(event))

    async def play(self, websocket, player: str, movement: str, controller: GameController, connections: set):
        if len(self.CONNECTIONS[controller.game_key][0]) < 2:
            await self.send_error(websocket, "You must wait for another player to play")
            return

        try:
            # Play the move.
            controller.play(player, movement)
        except (RuntimeError, AssertionError) as exc:
            # Send an "error" event if the move was illegal.
            await self.send_error(websocket, str(exc))
            return

        # Send a "play" event to update the UI.
        player_color = self.PLAYER_COLORS[controller.players.index(player)]
        event = {"type": "play", "player": player, "player_color": player_color, "movement": movement}
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
                await connection.close(1000, "OK")

            del self.CONNECTIONS[controller.game_key]

    async def join(self, websocket, game_key: str, player: str):
        game = self.game_repo.find(game_key)
        if game is None:
            await self.send_error(websocket, "Game not found")
            await websocket.close(1000, "OK")
            return

        if game["winner"] is not None:
            await self.send_error(websocket, "This game has ended")
            await websocket.close(1000, "OK")
            return

        if len(game["players"]) == 2 and player not in game["players"]:
            await self.send_error(websocket, "This game is full")
            await websocket.close(1000, "OK")
            return

        try:
            connections, controller = self.CONNECTIONS[game_key]
        except KeyError:
            connections = {websocket}
            controller = GameController(**game)
            self.CONNECTIONS[game_key] = connections, controller

        if player not in controller.players:
            controller.add_player(player)
            self.game_repo.update(players=controller.players)
            self.game_repo.commit()

        # Register to receive moves from this game.
        connections.add(websocket)
        try:
            # Send all moves already played
            await self.replay(websocket, controller)
            # Listen to play events
            while True:
                message = await websocket.recv()
                event = json.loads(message)
                movement = event.get("movement")
                if movement is None:
                    continue  # another event, might be another join
                await self.play(websocket, player, movement, controller, connections)
                self.game_repo.update(board=controller.board, moves=controller.moves, winner=controller.winner)
                self.game_repo.commit()
        finally:
            connections.remove(websocket)

    async def handle_messages(self, websocket):
        message = await websocket.recv()
        event = json.loads(message)
        event_type = event["type"]

        if event_type == "join":
            game_key = event["game_key"]
            player = event["username"]
            await self.join(websocket, game_key, player)
