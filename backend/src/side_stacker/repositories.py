import abc
import secrets
from typing import Optional

from constants import EMPTY_CHARACTER, GAME_COLUMNS, GAME_ROWS
from mongo import database


class AbstractRepository(abc.ABC):
    @abc.abstractmethod
    def create(self, *args, **kwargs):
        raise NotImplementedError

    @abc.abstractmethod
    def find(self, *args, **kwargs):
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, *args, **kwargs):
        raise NotImplementedError

    @abc.abstractmethod
    def commit(self):
        raise NotImplementedError


class GameRepository(AbstractRepository):
    def __init__(self):
        self.game = None

    def create(self, player_username: str):
        game_key = secrets.token_urlsafe(12)
        game_board = [[EMPTY_CHARACTER] * GAME_COLUMNS for _ in range(GAME_ROWS)]

        self.game = {"key": game_key, "board": game_board, "players": [player_username], "moves": [], "winner": None}

        return game_key

    def find(self, game_key: str, refresh: bool = False) -> Optional[dict]:
        if self.game is None or refresh:
            game = self._find(game_key)
            if game:
                # Remove the mongo _id and store in memory
                del game["_id"]
                self.game = game
        return self.game

    def update(self, **kwargs):
        assert self.game is not None, "GameRepository.update is not supposed to be called without creating a game first"

        for key, value in kwargs.items():
            self.game[key] = value

    def commit(self):
        assert self.game is not None, "GameRepository.commit is not supposed to be called without creating a game first"

        database.games.replace_one({"key": self.game["key"]}, self.game, upsert=True)

    def _find(self, game_key: str) -> Optional[dict]:
        """
        The only get-like method that actually touches the database, pattern useful for testing and data integrity
        """
        return database.games.find_one({"key": game_key})
