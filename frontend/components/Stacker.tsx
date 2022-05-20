import { useCallback, useEffect } from "react";
import cx from "classnames";
import { BOARD_COLUMNS, BOARD_ROWS, SIDE_LEFT, SIDE_RIGHT } from "./constants";
import { useGameContext } from "./GameContext";
import { GameId, PlayerName, X, Y } from './types';

const deriveCellSide = (columnIndex: X) => {
  const columnsHalf = Math.floor(BOARD_COLUMNS / 2);
  return columnIndex < columnsHalf ? SIDE_LEFT : SIDE_RIGHT;
};

interface WithOnMove {
  onMove: (ci: X, ri: Y) => void;
}

interface CellProps extends WithOnMove {
  rowIndex: Y;
  columnIndex: X;
}

const Cell = ({ rowIndex, columnIndex, onMove }: CellProps) => {
  const { game } = useGameContext();
  const player = game[rowIndex][columnIndex];
  const handleClick = useCallback(() => {
    onMove(columnIndex, rowIndex);
  }, [onMove, columnIndex, rowIndex]);
  return (
    <div
      className={cx(
        "cell",
        {
          empty: !player,
        },
        player
      )}
      onClick={handleClick}
    />
  );
};

const Board = ({ onMove }: WithOnMove) => {
  return (
    <div className="board">
      {Array.from(Array(BOARD_ROWS).keys()).map((ri) => (
        <div className="row" key={ri}>
          {Array.from(Array(BOARD_COLUMNS).keys()).map((ci) => (
            <Cell key={ci} rowIndex={ri as Y} columnIndex={ci as X} onMove={onMove} />
          ))}
        </div>
      ))}
    </div>
  );
};

interface Props {
  gameId: GameId;
  playerName: PlayerName;
}

export const Stacker = ({ gameId, playerName }: Props) => {
  const { join, move } = useGameContext();
  useEffect(() => {
    if (!gameId || !playerName) return;
    return join(gameId, playerName);
  }, [gameId, playerName, join]);
  const handleMove = useCallback(
    (x: X, y: Y) => {
      const side = deriveCellSide(x);
      move(playerName, y, side);
    },
    [move, playerName]
  );
  return <Board onMove={handleMove} />;
};
