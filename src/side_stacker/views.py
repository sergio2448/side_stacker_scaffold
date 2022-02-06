from sanic.response import file, redirect

from src.side_stacker.game_handler import GameHandler
from src.side_stacker.repositories import GameRepository
from src.side_stacker.utils import get_path_to_html


async def index(request):
    return await file(get_path_to_html("index.html"))


async def create_game(request):
    username = request.form.get("username")
    game_repository = GameRepository()
    game_key = game_repository.create(username)
    game_repository.commit()
    return redirect(f"/play/{game_key}/{username}")


async def play(request, game_key, username):
    return await file(get_path_to_html("board.html"))


async def game(request, websocket):
    game_handler = GameHandler()
    while True:
        await game_handler.handle_messages(websocket)
