from unittest.mock import patch

import pytest
from playhouse.shortcuts import model_to_dict

from src.side_stacker.constants import EMPTY_CHARACTER, GAME_COLUMNS, GAME_ROWS
from src.side_stacker.db import Game as DbGame
from src.side_stacker.repositories import GameRepository


def test_create_mongo(game_repository_mongo):
    do_test_create(game_repository_mongo)


def test_create_(game_repository):
    do_test_create(game_repository)


def do_test_create(game_repository):
    USERNAME = "milton"
    game_key = game_repository.create(USERNAME)

    assert type(game_key) == str
    assert len(game_key) == 16

    created_game = game_repository.game
    assert created_game["key"] == game_key
    assert created_game["board"] == [[EMPTY_CHARACTER] * GAME_COLUMNS for _ in range(GAME_ROWS)]
    assert created_game["players"] == [USERNAME]
    assert created_game["moves"] == []


@patch("src.side_stacker.repositories.GameRepositoryMongo._find")
def test_find_mongo(mock__find, game_repository_mongo):
    do_test_find(mock__find, game_repository_mongo, "qweljqk12")


@patch("src.side_stacker.repositories.GameRepository._find")
def test_find(mock__find, game_repository):
    do_test_find(mock__find, game_repository)


def do_test_find(mock__find, game_repository, id=None):
    mock__find.return_value = None
    GAME_KEY = "12345"
    expected_game = {"key": GAME_KEY, "board": [], "players": []}

    # Without game
    assert game_repository.find(GAME_KEY) is None
    assert mock__find.call_count == 1

    # Find it in memory
    game_repository.game = expected_game
    assert game_repository.find(GAME_KEY) == expected_game
    assert mock__find.call_count == 1

    game_repository.game = None
    mock__find.return_value = {**expected_game, **({"_id": id} if id is not None else {})}
    assert game_repository.find(GAME_KEY) == expected_game
    assert mock__find.call_count == 2
    # It also should add it to memory without the _id
    assert game_repository.game == expected_game

    # Refreshing should hit the database too!
    game_repository.game = None
    mock__find.return_value = {**expected_game, **({"_id": id} if id is not None else {})}
    assert game_repository.find(GAME_KEY, refresh=True) == expected_game
    assert mock__find.call_count == 3

def test_update(game_repository):
    do_test_update(game_repository)


def test_update_mongo(game_repository_mongo):
    do_test_update(game_repository_mongo)


def do_test_update(game_repository):
    # Call it without having called find first
    with pytest.raises(AssertionError):
        game_repository.update(hola="hola")

    game_repository.game = {"key": "12345", "board": [], "players": []}

    # Single value updates
    game_repository.update(players=["Milton"])
    assert game_repository.game == {"key": "12345", "board": [], "players": ["Milton"]}

    # Multiple value updates
    game_repository.update(board=[1, 2, 3, 4], players=["Milton", "Juan"])
    assert game_repository.game == {"key": "12345", "board": [1, 2, 3, 4], "players": ["Milton", "Juan"]}


# similar to test_commit
def test_commit_mongo(clean_db, database_mongo, game_repository_mongo):
    # Call it without having called find first
    with pytest.raises(AssertionError):
        game_repository_mongo.commit()

    # If the game doesn't exist in the database it creates it
    assert database_mongo.games.count_documents({}) == 0
    game_repository_mongo.game = {"key": "12345", "board": [], "players": []}
    game_repository_mongo.commit()
    games = list(database_mongo.games.find({}))
    assert len(games) == 1
    # Testing dict is a subset of the one retrieved in the db because of the mongo "_id" key
    assert {"key": "12345", "board": [], "players": []}.items() <= games[0].items()

    # If the game exists, update it
    game_repository_mongo.game = {"key": "12345", "board": [], "players": ["Milton"]}
    game_repository_mongo.commit()
    games = list(database_mongo.games.find({}))
    assert len(games) == 1
    assert {"key": "12345", "board": [], "players": ["Milton"]}.items() <= games[0].items()


# similar to test_commit_mongo
def test_commit(clean_db, db_games: DbGame, game_repository):
    # Call it without having called find first
    with pytest.raises(AssertionError):
        game_repository.commit()

    # If the game doesn't exist in the database it creates it
    assert db_games.select().count() == 0
    game_repository.game = {"key": "12345", "board": [], "players": [], "moves": []}
    game_repository.commit()
    games = list(db_games.select())
    assert len(games) == 1
    assert {"key": "12345", "moves": "[]", "board": "[]", "player1": None, "player2": None, "winner": None} == model_to_dict(games[0])

    # If the game exists, update it
    game_repository.game = {"key": "12345", "board": [], "players": ["Milton"], "moves": []}
    game_repository.commit()
    games = list(db_games.select())
    assert len(games) == 1
    assert {"key": "12345", "moves": "[]", "board": "[]", "player1": "Milton", "player2": None, "winner": None} == model_to_dict(games[0])


def test__find_hitting_db(clean_db, database_mongo, db_games: DbGame, game_repository, game_repository_mongo):
    GAME_KEY = "12345"
    expected_game = {"key": GAME_KEY, "board": [], "players": [], "moves": []}
    assert game_repository_mongo._find(GAME_KEY) is None
    db_games.insert(**GameRepository.serialize_game(expected_game)).execute()
    database_mongo.games.insert_one(expected_game)

    def assert_found_game(g):
        assert g["key"] == GAME_KEY
        assert g["board"] == []
        assert g["players"] == []

    found_game = game_repository._find(GAME_KEY)
    assert_found_game(found_game)
    found_game_mongo = game_repository_mongo._find(GAME_KEY)
    assert_found_game(found_game_mongo)
