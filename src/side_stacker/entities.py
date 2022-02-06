import operator
from dataclasses import dataclass


@dataclass
class Position:
    row: int
    column: int

    @classmethod
    def generate_adjacent_position(cls, position, delta):
        row_delta, column_delta = delta
        new_row = operator.add(position.row, row_delta)
        new_column = operator.add(position.column, column_delta)
        return cls(new_row, new_column)
