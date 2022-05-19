import {useCallback, useEffect} from "react";
import cx from "classnames";
import {BOARD_COLUMNS, BOARD_ROWS, SIDE_LEFT, SIDE_RIGHT} from "./constants";
import {useGameContext} from "./GameContext";

const deriveCellSide = (columnIndex) => {
  const columnsHalf = Math.floor(BOARD_COLUMNS / 2);
  return columnIndex < columnsHalf ? SIDE_LEFT : SIDE_RIGHT;
};

const Cell = ({rowIndex, columnIndex, onMove}) => {
  const { game } = useGameContext();
  const player = game[rowIndex][columnIndex];
  const handleClick = useCallback(() => {
    onMove(columnIndex, rowIndex);
  }, [onMove, columnIndex, rowIndex]);
  return (
    <div className={cx("cell", {
      "empty": !player
    }, player)} onClick={handleClick} />
  );
}

const Board = ({onMove}) => {
  return (<div className="board">
    {Array.from(Array(BOARD_ROWS).keys()).map((ri) => <div className="row" key={ri}>
      {Array.from(Array(BOARD_COLUMNS).keys()).map((ci) => <Cell key={ci} rowIndex={ri} columnIndex={ci} onMove={onMove} />)}
    </div>)}
  </div>);
}

export const ReactStacker = ({gameId, playerName}) => {
  const { join, move } = useGameContext();
  useEffect(() => {
    if (!gameId || !playerName) return;
    return join(gameId, playerName);
  }, [gameId, playerName, join]);
  const handleMove = useCallback((x, y) => {
    const side = deriveCellSide(x);
    move(playerName, y, side);
  }, [move, playerName]);
  return (
    <Board onMove={handleMove} />
  );
}