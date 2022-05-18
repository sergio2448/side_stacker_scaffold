// accepts board html element
import { createBoard, joinGame, receiveMoves, sendMoves } from "./sideStacker";
import {getApiPathWS} from "../env";

export const initPlainUi = (board, gameId, playerName) => {
  const destroyBoard = createBoard(board);

// Open the WebSocket connection and register event handlers.
  const websocket = new WebSocket(getApiPathWS());
  const leaveGame = joinGame(websocket, gameId, playerName);
  const stopReceivingMoves = receiveMoves(board, websocket);
  const stopSendingMoves = sendMoves(board, websocket, playerName);
  return () => {
    destroyBoard();
    leaveGame();
    stopReceivingMoves();
    stopSendingMoves();
  }
}