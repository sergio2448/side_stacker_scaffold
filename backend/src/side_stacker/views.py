from sanic.response import file, json

from src.side_stacker.game_handler import GameHandler
from src.side_stacker.repositories import GameRepository
from src.side_stacker.utils import get_path_to_html


async def index(request):
    return await file(get_path_to_html("index.html"))


async def create_game(request):
    username = request.form["username"][0]  # required
    game_repository = GameRepository()
    game_key = game_repository.create(username)
    game_repository.commit()
    return json({"game_key": game_key})

async def game(request, websocket):
    game_handler = GameHandler()
    while True:
        await game_handler.handle_messages(websocket)
