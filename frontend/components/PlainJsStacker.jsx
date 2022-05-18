import {useEffect, useState} from "react";
import {initPlainUi} from "./plainJs";

export const PlainJsStacker = ({gameId, playerName}) => {
  const [boardElement, setBoardElement] = useState();
  useEffect(() => {
    if (!boardElement) return;
    return initPlainUi(boardElement, gameId, playerName);
  }, [boardElement]);
  return (
    <div className="board" ref={setBoardElement}>

    </div>
  );
}