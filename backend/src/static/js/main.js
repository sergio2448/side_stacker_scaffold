import { createBoard, sendMoves, receiveMoves, joinGame } from "./side-stacker.js";

window.addEventListener("DOMContentLoaded", () => {
  // Initialize the UI.
  const board = document.querySelector(".board");
  createBoard(board);

  // Open the WebSocket connection and register event handlers.
  const websocket = new WebSocket(`ws://${document.domain}:${location.port}/game`);
  joinGame(websocket);
  receiveMoves(board, websocket);
  sendMoves(board, websocket);
});