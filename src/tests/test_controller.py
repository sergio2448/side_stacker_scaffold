from unittest.mock import patch

import pytest

from src.side_stacker.constants import (
    ALL_POSSIBLE_WINNING_COMBINATIONS,
    GAME_COLUMNS,
    GAME_ROWS,
    PLAYER1,
    PLAYER2,
)
from src.side_stacker.types import Position


def test_player_in_turn(controller):
    # If it's the turn 0 the player_in_turn should be 1
    assert controller.player_in_turn == PLAYER1

    # Let's increase the turn
    controller.turn += 1
    # the next turn should be player 2
    assert controller.player_in_turn == PLAYER2


def test_check_winner(controller):
    with patch("src.side_stacker.controller.GameController.check_winning_combination") as comb_checker_mock:
        # If there's a winning combination anywhere it should return there's a winner, since the first combination is
        # the winner, the checker should have been called once
        comb_checker_mock.return_value = True
        assert controller.check_winner(1, Position(1, 1)) is True
        comb_checker_mock.assert_called_once()

        # However, if there's not a winner it should return False and the checker should be called for all of
        # the combinations
        comb_checker_mock.return_value = False
        assert controller.check_winner(1, Position(1, 1)) is False
        # Minus the previous call
        assert (comb_checker_mock.call_count - 1) == len(ALL_POSSIBLE_WINNING_COMBINATIONS)


def test_check_winning_combination(controller):
    # Let's look for a horizontal win in the first row, by playing the move "0L"
    zero_left = Position(0, 0)
    controller.repo.set_player_in_position(zero_left, PLAYER1)
    # The combination we want to validate are three positions to the right
    combination = [(1, 0), (2, 0), (3, 0)]  # X _ _ _

    # First, since there's nothing in the board, the method should return False
    assert controller.check_winning_combination(PLAYER1, zero_left, combination) is False

    # Then, if we populate those possitions, the combination should trigger.
    controller.repo.set_player_in_position(Position(1, 0), PLAYER1)
    controller.repo.set_player_in_position(Position(2, 0), PLAYER1)
    controller.repo.set_player_in_position(Position(3, 0), PLAYER1)

    assert controller.check_winning_combination(PLAYER1, zero_left, combination) is True


def test_cast_movement_to_position_multiple_movements(controller):
    position = controller.cast_movement_to_position("0R")
    assert position == Position(0, 6)
    controller.repo.set_player_in_position(position, PLAYER1)

    position = controller.cast_movement_to_position("0R")
    assert position == Position(0, 5)
    controller.repo.set_player_in_position(position, PLAYER2)

    position = controller.cast_movement_to_position("0L")
    assert position == Position(0, 0)
    controller.repo.set_player_in_position(position, PLAYER1)

    position = controller.cast_movement_to_position("0L")
    assert position == Position(0, 1)
    controller.repo.set_player_in_position(position, PLAYER2)

    position = controller.cast_movement_to_position("3R")
    assert position == Position(3, 6)
    controller.repo.set_player_in_position(position, PLAYER1)

    position = controller.cast_movement_to_position("3R")
    assert position == Position(3, 5)
    controller.repo.set_player_in_position(position, PLAYER1)


def test_cast_movement_to_position_invalid_movement(controller):
    with pytest.raises(RuntimeError, match="Invalid movement HOLA"):
        controller.cast_movement_to_position("HOLA")

    with pytest.raises(AssertionError, match="Movement should be '#L' or '#R' where # is a row and L=left, R=right"):
        controller.cast_movement_to_position("0A")

    with pytest.raises(AssertionError, match=f"Row must be a numeric value between 0 and {GAME_ROWS - 1}"):
        controller.cast_movement_to_position("AL")


def test_cast_movement_to_position_full_row(controller):
    # First row full of 1s
    controller.repo.board[0][0:GAME_COLUMNS] = [1] * GAME_COLUMNS

    with pytest.raises(RuntimeError, match="The row 0 is full."):
        controller.cast_movement_to_position("0L")


def test_play_with_a_player_not_in_turn(controller):
    # The first turn is for PLAYER1
    with pytest.raises(RuntimeError, match="It isn't your turn."):
        controller.play(PLAYER2, "0L")


def test_play_with_sets_winner_and_increases_turn(controller):
    assert controller.winner is None
    assert controller.turn == 0

    with patch("src.side_stacker.controller.GameController.check_winner") as check_winner_mock:
        check_winner_mock.return_value = True
        controller.play(PLAYER1, "0R")

    assert controller.winner == PLAYER1
    assert controller.turn == 1
