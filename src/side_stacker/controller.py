from typing import List, Tuple

from src.side_stacker.constants import (
    ALL_POSSIBLE_WINNING_COMBINATIONS,
    EMPTY_CHARACTER,
    GAME_COLUMNS,
    GAME_ROWS,
)
from src.side_stacker.entities import Position


class GameController:
    """
    Side Stacker game controller.

    Play moves with :meth:`play`.

    Check for a victory with :attr:`winner`.

    """

    def __init__(
        self,
        key: str = None,
        board: List[List] = None,
        moves: List[Tuple] = None,
        players: List[str] = None,
        winner: str = None,
    ):
        self.game_key = key
        self.moves = moves or []
        self.board = board or [[EMPTY_CHARACTER] * GAME_COLUMNS for _ in range(GAME_ROWS)]
        self.players = players or []
        self.winner = winner

    @property
    def player_in_turn(self):
        return self.players[len(self.moves) % 2]

    def get_player_in_position(self, position: Position):
        return self.board[position.row][position.column]

    def set_player_in_position(self, position: Position, player: str):
        self.board[position.row][position.column] = player

    def get_row(self, row: int):
        return self.board[row][0:GAME_COLUMNS]

    def add_player(self, player: str):
        self.players.append(player)

    def check_winner(self, player: str, position: Position):
        """
        Whether the current move is winning. Check all possible winning combinations for the last move
        """

        for combination in ALL_POSSIBLE_WINNING_COMBINATIONS:
            if self.check_winning_combination(player, position, combination):
                return True

        return False

    def check_winning_combination(self, player: str, position: Position, combination: List[Tuple]):
        for position_delta in combination:
            position_to_check = Position.generate_adjacent_position(position, position_delta)

            # If the combination is outside of the board then it's not a winning move
            if position_to_check.row >= GAME_ROWS or position_to_check.column >= GAME_COLUMNS:
                return False

            if self.get_player_in_position(position_to_check) != player:
                return False

        return True

    def cast_movement_to_position(self, movement: str) -> Position:
        """
        Gets a movement in the format "NS" where N is a row and S is a side 'L': left, 'R': right and converts it to a
        position in the game board, validating first if the movement is valid
        """
        try:
            row, side = movement
        except (TypeError, ValueError):
            raise RuntimeError(f"Invalid movement {movement}")

        assert side in ["L", "R"], "Movement should be '#L' or '#R' where # is a row and L=left, R=right"
        assert (
            row.isdigit() and int(row) >= 0 and int(row) < GAME_ROWS
        ), f"Row must be a numeric value between 0 and {GAME_ROWS - 1}"

        row = int(row)
        row_slots = self.get_row(row)
        # Validate the row has free slots
        has_free_slots = any([pos == EMPTY_CHARACTER for pos in row_slots])

        if not has_free_slots:
            raise RuntimeError(f"The row {row} is full.")

        # Get the side-st position
        if side == "R":
            reversed_column = row_slots[::-1].index(EMPTY_CHARACTER)
            column = (GAME_COLUMNS - 1) - reversed_column
        else:
            column = row_slots.index(EMPTY_CHARACTER)

        return Position(row, column)

    def play(self, player: str, movement: str):
        """
        Play a movement in the board, returns the position where the checker lands

        Raises :exc:`RuntimeError` if it's not player's turn.
        """
        position = self.cast_movement_to_position(movement)

        if player != self.player_in_turn:
            raise RuntimeError("It isn't your turn.")

        self.set_player_in_position(position, player)

        if self.winner is None and self.check_winner(player, position):
            self.winner = player

        move = (player, movement)
        self.moves.append(move)
