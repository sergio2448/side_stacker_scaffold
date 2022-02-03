from src.side_stacker.constants import GAME_COLUMNS, GAME_ROWS
from src.side_stacker.types import Position


class GameRepository:
    def __init__(self):
        self.board = [[0] * GAME_COLUMNS for _ in range(GAME_ROWS)]

    def get_player_in_position(self, position: Position):
        return self.board[position.row][position.column]

    def set_player_in_position(self, position: Position, player: int):
        self.board[position.row][position.column] = player

    def get_row(self, row: int):
        return self.board[row][0:GAME_COLUMNS]

    def commit(self):
        pass
