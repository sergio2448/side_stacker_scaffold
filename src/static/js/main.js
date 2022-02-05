import { createBoard, sendMoves, receiveMoves, initGame } from "./side-stacker.js";

window.addEventListener("DOMContentLoaded", () => {
  // Initialize the UI.
  const board = document.querySelector(".board");
  createBoard(board);

  // Open the WebSocket connection and register event handlers.
  const websocket = new WebSocket(`ws://${document.domain}:${location.port}/game`);
  initGame(websocket);
  receiveMoves(board, websocket);
  sendMoves(board, websocket);
});