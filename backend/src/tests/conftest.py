import os

import pytest

from src.side_stacker.controller import GameController
from src.side_stacker.repositories import GameRepository

os.environ["MONGODB_HOST"] = os.environ.get("MONGODB_HOST", "0.0.0.0")
os.environ["MONGODB_PORT"] = "27017"
os.environ["MONGODB_USER"] = "root"
os.environ["MONGODB_PASS"] = "toor"
os.environ["MONGODB_DB"] = "sidestacker-test"


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
def clean_db(database):
    database.games.delete_many({})
    database.moves.delete_many({})
    yield
    database.games.delete_many({})
    database.moves.delete_many({})


@pytest.fixture
def database():
    from src.side_stacker.mongo import database

    return database
