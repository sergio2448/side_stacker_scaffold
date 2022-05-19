import { useEffect, useState } from "react";
import { initPlainUi } from "./plainJs";
import { useWebSocket } from "./WebSocketContext";

export const PlainJsStacker = ({ gameId, playerName }) => {
  const [boardElement, setBoardElement] = useState();
  const webSocket = useWebSocket();
  useEffect(() => {
    if (!boardElement) return;
    if (!webSocket) return;
    return initPlainUi(boardElement, gameId, playerName, webSocket);
  }, [boardElement, webSocket, gameId, playerName]);
  return <div className="board" ref={setBoardElement}></div>;
};
