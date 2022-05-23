import os

from peewee import *

# note: peewee seems to be not very usable! i.e. https://github.com/coleifer/peewee/issues/1663
# and migrations lib isn't documented well at this point
# https://github.com/klen/peewee_migrate/issues/114#issuecomment-568979704
# maybe sqlalchemy is a better choice for anything after all

db_connection = SqliteDatabase(os.environ.get("SQLITE_PATH", "games.db"))


class Game(Model):
    # {"key": game_key, "board": game_board, "players": [player_username], "moves": [], "winner": None}
    key = CharField(primary_key=True)
    board = CharField()  # TODO JSONField?
    player1 = CharField(null=True)
    player2 = CharField(null=True)
    moves = TextField()  # TODO JSONField or a join
    winner = CharField(null=True)

    class Meta:
        database = db_connection