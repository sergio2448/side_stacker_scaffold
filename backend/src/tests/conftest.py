import os

import pytest

from src.side_stacker.controller import GameController
from src.side_stacker.db import Game as DbGame
from src.side_stacker.repositories import GameRepository

os.environ["SQLITE_PATH"] = os.environ.get("SQLITE_PATH", "games_test.db")


@pytest.fixture
def game_repository() -> GameRepository:
    return GameRepository()


@pytest.fixture()
def controller() -> GameController:
    return GameController()


@pytest.fixture(scope="module")
def persistent_controller() -> GameController:
    return GameController()


@pytest.fixture(scope="function")
def clean_db(db_games: DbGame):
    db_games.delete().execute()


@pytest.fixture
def db_games():
    return DbGame
