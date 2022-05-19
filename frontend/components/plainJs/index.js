// accepts board html element
import { createBoard, joinGame, receiveMoves, sendMoves } from "./sideStacker";
import { getApiPathWS } from "../env";

export const initPlainUi = (board, gameId, playerName, websocket) => {
  const destroyBoard = createBoard(board);
  const stopListeningJoin = joinGame(websocket, gameId, playerName);
  const stopReceivingMoves = receiveMoves(board, websocket);
  const stopSendingMoves = sendMoves(board, websocket, playerName);
  return () => {
    destroyBoard();
    stopListeningJoin();
    stopReceivingMoves();
    stopSendingMoves();
  };
};
