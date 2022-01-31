import { createBoard, playMove, sendMoves, receiveMoves } from "./side-stacker.js";

window.addEventListener("DOMContentLoaded", () => {
  // Initialize the UI.
  const board = document.querySelector(".board");
  createBoard(board);

  // Open the WebSocket connection and register event handlers.
  const websocket = new WebSocket("ws://localhost:8001/");
  receiveMoves(board, websocket);
  sendMoves(board, websocket);
});