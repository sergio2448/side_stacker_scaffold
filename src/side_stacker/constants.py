# Each element in each list is a position-delta (row, column) in the board that should be taken by the player so a move
# can be considered a winning move.
# negative values are variances to the left and up and positive to the right and down depending on the axis.

VERTICAL_WINNING_COMBINATIONS = [
    [(-3, 0), (-2, 0), (-1, 0)],  # The three rows above the position
    [(-2, 0), (-1, 0), (1, 0)],  # One position below and two above
    [(-1, 0), (1, 0), (2, 0)],  # Two positions above and two below
    [(1, 0), (2, 0), (3, 0)],  # The three rows below the position
]

HORIZONTAL_WINNING_COMBINATIONS = [
    [(0, -1), (0, -2), (0, -3)],  # _ _ _ X
    [(0, 1), (0, -1), (0, -2)],  # _ _ X _
    [(0, 2), (0, 1), (0, -1)],  # _ X _ _
    [(0, 3), (0, 2), (0, 1)],  # X _ _ _
]

LEFT_DIAGONAL_WINNING_COMBINATIONS = [
    [(1, 1), (2, 2), (3, 3)],  # Three right-down positions
    [(-1, -1), (1, 1), (2, 2)],  # One position left-up and two right-down
    [(-2, -2), (-1, -1), (1, 1)],  # Two positions left-up and one right-down
    [(-3, -3), (-2, -2), (-1, -1)],  # Three position above to the left diagonal
]

RIGHT_DIAGONAL_WINNING_COMBINATIONS = [
    [(-1, 1), (-2, 2), (-3, 3)],  # Three right-up positions
    [(1, -1), (-1, 1), (-2, 2)],  # One position right-up and two left-down
    [(2, -2), (1, -1), (-1, 1)],  # Two positions right-up and one left-down
    [(3, -3), (2, -2), (1, -1)],  # Three position right-up
]

ALL_POSSIBLE_WINNING_COMBINATIONS = (
    HORIZONTAL_WINNING_COMBINATIONS
    + VERTICAL_WINNING_COMBINATIONS
    + RIGHT_DIAGONAL_WINNING_COMBINATIONS
    + LEFT_DIAGONAL_WINNING_COMBINATIONS
)

GAME_ROWS = 7
GAME_COLUMNS = 7
EMPTY_CHARACTER = "_"
