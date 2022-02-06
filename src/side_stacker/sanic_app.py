import os

from sanic import Sanic
from views import create_game, game, index, play

app = Sanic(__name__)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app.static("/static", os.path.join(BASE_DIR, "static"))

app.add_route(index, "/")
app.add_route(create_game, "/create-game", methods=["POST"])
app.add_route(play, "/play/<game_key>/<username>")
app.add_websocket_route(game, "/game")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True, auto_reload=True)
