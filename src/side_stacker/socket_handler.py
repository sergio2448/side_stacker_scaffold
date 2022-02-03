import asyncio
import itertools
import json

from constants import PLAYER1, PLAYER2
from controller import GameController
from repository import GameRepository


class SocketHandler:
    async def handle_messages(self, websocket):
        game_repository = GameRepository()
        game_controller = GameController(game_repository)

        # Players take alternate turns, using the same browser.
        turns = itertools.cycle([PLAYER1, PLAYER2])
        player = next(turns)

        async for message in websocket:
            # Parse a "play" event from the UI.
            event = json.loads(message)
            print(event)
            assert event["type"] == "play"
            movement = event["movement"]

            try:
                # Play the move.
                game_controller.play(player, movement)
            except (RuntimeError, AssertionError) as exc:
                # Send an "error" event if the move was illegal.
                event = {
                    "type": "error",
                    "message": str(exc),
                }
                await websocket.send(json.dumps(event))
                continue

            # Send a "play" event to update the UI.
            event = {"type": "play", "player": player, "movement": movement}
            await websocket.send(json.dumps(event))

            # If move is winning, send a "win" event.
            if game_controller.winner is not None:
                event = {
                    "type": "win",
                    "player": game_controller.winner,
                }
                await websocket.send(json.dumps(event))

            # Alternate turns.
            player = next(turns)
