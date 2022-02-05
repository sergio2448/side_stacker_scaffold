import os

from sanic import Sanic
from views import game, index

app = Sanic(__name__)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app.static("/static", os.path.join(BASE_DIR, "static"))

app.add_route(index, "/")
app.add_websocket_route(game, "/game")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True, auto_reload=True)
