import abc
import json
import secrets
from typing import Optional, List, Tuple, Dict

from src.side_stacker.constants import EMPTY_CHARACTER, GAME_COLUMNS, GAME_ROWS
from src.side_stacker.db import Game as DbGames


class AbstractRepository(abc.ABC):
    def __init__(self):
        self.game = None

    def assert_present(self):
        assert self.game is not None, "is not supposed to be called without creating a game first"

    def create(self, player_username: str):
        assert player_username
        game_key = secrets.token_urlsafe(12)
        game_board = [[EMPTY_CHARACTER] * GAME_COLUMNS for _ in range(GAME_ROWS)]

        self.game = {"key": game_key, "board": game_board, "players": [player_username], "moves": [], "winner": None}

        return game_key

    @abc.abstractmethod
    def find(self, *args, **kwargs):
        raise NotImplementedError

    def update(self, **kwargs):
        self.assert_present()
        for key, value in kwargs.items():
            self.game[key] = value

    @abc.abstractmethod
    def commit(self):
        raise NotImplementedError


def safe_list_get(l, idx, default):
    try:
        return l[idx]
    except IndexError:
        return default


class GameRepository(AbstractRepository):

    @staticmethod
    def serialize_game(game) -> Dict:
        return {
            "key": game["key"],
            "board": GameRepository._serialize_board(game["board"]),
            "player1": safe_list_get(game["players"], 0, None),
            "player2": safe_list_get(game["players"], 1, None),
            "moves": GameRepository._serialize_moves(game["moves"])
        }

    @staticmethod
    def _serialize_board(board: [[str]]) -> str:
        return json.dumps(board)

    @staticmethod
    def _parse_board(board: str) -> [[str]]:
        return json.loads(board)

    @staticmethod
    def _serialize_moves(moves: List[Tuple]) -> str:
        return json.dumps(moves)

    @staticmethod
    def _parse_moves(moves: str) -> List[Tuple]:
        return json.loads(moves)

    def find(self, game_key: str, refresh: bool = False) -> Optional[dict]:
        if self.game is None or refresh:
            game = self._find(game_key)
            if game:
                self.game = game
        return self.game

    def commit(self):
        self.assert_present()
        DbGames.replace(**self.serialize_game(self.game)).execute()

    def _find(self, game_key: str) -> Optional[dict]:
        """
        The only get-like method that actually touches the database, pattern useful for testing and data integrity
        """
        game = DbGames.get_or_none(DbGames.key == game_key)
        if game is None:
            return None
        return {
            "key": game.key,
            "board": self._parse_board(game.board),
            "players": [p for p in [game.player1, game.player2] if p is not None],
            "moves": self._parse_moves(game.moves),
            "winner": game.winner,
        }