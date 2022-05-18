import os

from sanic import Sanic

from src.side_stacker.cors import add_cors_headers
from src.side_stacker.options import setup_options
from src.side_stacker.views import create_game, game, index

# migrations should be a one-off script but with this app we're fine running it here for user convenience
# TODO module is not importable, why
# from peewee_migrate import Router as MigrationRouter


app = Sanic(__name__)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app.static("/static", os.path.join(BASE_DIR, "static"))

app.add_route(index, "/")
app.add_route(create_game, "/create-game", methods=["POST"])
app.add_websocket_route(game, "/game")

# Add OPTIONS handlers to any route that is missing it
app.register_listener(setup_options, "before_server_start")

# Fill in CORS headers
app.register_middleware(add_cors_headers, "response")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True, auto_reload=True)
