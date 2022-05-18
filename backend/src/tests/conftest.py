import os

import pytest

from src.side_stacker.controller import GameController
from src.side_stacker.db import Game as DbGame
from src.side_stacker.repositories import GameRepository, GameRepositoryMongo

os.environ["SQLITE_PATH"] = os.environ.get("SQLITE_PATH", "games_test.db")

os.environ["MONGODB_HOST"] = os.environ.get("MONGODB_HOST", "0.0.0.0")
os.environ["MONGODB_PORT"] = "27017"
os.environ["MONGODB_USER"] = "root"
os.environ["MONGODB_PASS"] = "toor"
os.environ["MONGODB_DB"] = "sidestacker-test"



@pytest.fixture
def game_repository() -> GameRepository:
    return GameRepository()

@pytest.fixture
def game_repository_mongo() -> GameRepositoryMongo:
    return GameRepositoryMongo()

@pytest.fixture()
def controller() -> GameController:
    return GameController()


@pytest.fixture(scope="module")
def persistent_controller() -> GameController:
    return GameController()


@pytest.fixture(scope="function")
def clean_db(database_mongo, db_games: DbGame):
    db_games.delete().execute()

    # TODO two times?
    database_mongo.games.delete_many({})
    database_mongo.moves.delete_many({})
    yield
    database_mongo.games.delete_many({})
    database_mongo.moves.delete_many({})


@pytest.fixture
def database_mongo():
    from src.side_stacker.mongo import database

    return database

@pytest.fixture
def db_games():
    return DbGame
