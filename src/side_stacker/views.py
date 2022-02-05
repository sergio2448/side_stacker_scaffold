from sanic.response import file
from socket_handler import SocketHandler
from utils import get_path_to_html


async def index(request):
    return await file(get_path_to_html("index.html"))


async def game(request, websocket):
    socket_handler = SocketHandler()
    while True:
        await socket_handler.handle_messages(websocket)
