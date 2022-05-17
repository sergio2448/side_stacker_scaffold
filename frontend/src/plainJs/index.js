// accepts board html element
import { createBoard, joinGame, receiveMoves, sendMoves } from "./sideStacker";
import {getApiPathWS} from "../env";

export const initPlainUi = (board, gameId, playerName) => {
  createBoard(board);

// Open the WebSocket connection and register event handlers.
  const websocket = new WebSocket(getApiPathWS());
  joinGame(websocket, gameId, playerName);
  receiveMoves(board, websocket);
  sendMoves(board, websocket, playerName);
}