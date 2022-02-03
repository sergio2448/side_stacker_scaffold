import pytest

from src.side_stacker.controller import GameController
from src.side_stacker.repository import GameRepository


@pytest.fixture
def repository() -> GameRepository:
    return GameRepository()


@pytest.fixture
def controller(repository) -> GameController:
    return GameController(repository)
