import {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import { getApiPathWS } from "./env";
import {BOARD_COLUMNS, BOARD_ROWS, SIDE_RIGHT} from "./constants";
import {joinGame, showMessage} from "./plainJs/sideStacker";
import {useWebSocket, WebSocketContextProvider} from "./WebSocketContext";

const initEmpty = () => Array(BOARD_ROWS).fill(null).map(() => Array(BOARD_COLUMNS).fill(null));

const gameContext = createContext(null);
export const GameContextProvider = ({children}) => {
  const [game, setGame_] = useState(initEmpty);
  const gameRef = useRef(game); // don't reload join() a lot
  const setGame = useCallback((game) => {
    setGame_(game);
    gameRef.current = game;
  }, [])
  const webSocket = useWebSocket();

  const playMove = useCallback((playerColor, move) => {
    const game = gameRef.current; // shadow state
    const y = parseInt(move[0], 10);
    const row = game[y];
    const side = move[1];
    const rowForSearch = [...row];
    if (side === SIDE_RIGHT) rowForSearch.reverse();
    const x_ = rowForSearch.findIndex(p => !p);
    if (x_ === -1) throw new RangeError(`Row is full`);
    const x = side === SIDE_RIGHT ? row.length - 1 - x_ : x_; // reverse back
    // throw new RangeError(`row must be between 0 and ${BOARD_ROWS}.`);
    // throw new RangeError(`column must be between 0 and ${BOARD_COLUMNS}.`);
    const game_ = [...game.map(r => [...r])];
    game_[y][x] = playerColor;
    setGame(game_);
  }, []);
  const receiveMoves = useCallback(() => {
    const listener = ({ data }) => {
      const event = JSON.parse(data);
      switch (event.type) {
        case "play":
          // Update the UI with the move.
          playMove(event.player_color, event.movement);
          break;
        case "win":
          showMessage(`Player ${event.player} wins!`);
          // No further messages are expected; close the WebSocket connection.
          webSocket.close(1000);
          break;
        case "error":
          showMessage(event.message);
          break;
        default:
          throw new Error(`Unsupported event type: ${event.type}.`);
      }
    };
    webSocket.addEventListener("message", listener);
    return () => webSocket.removeEventListener("message", listener);
  }, [webSocket, playMove]);
  const move = useCallback((playerName, row, side) => {
    const event = {
      type: "play",
      username: playerName,
      movement: `${row}${side}`,
    };
    webSocket.send(JSON.stringify(event));
  }, [webSocket]);
  const join = useCallback((gameId, playerName) => {
    const stopListeningJoin = joinGame(webSocket, gameId, playerName);
    const stopReceivingMoves = receiveMoves();
    return () => {
      stopListeningJoin();
      stopReceivingMoves();
      setGame(initEmpty());
    };
  }, [webSocket, receiveMoves]);
  const api = useMemo(() => ({
    game,
    join,
    move,
  }), [game, join, move]);
  return (
    <gameContext.Provider value={api}>
      {children}
    </gameContext.Provider>
  );
};
export const useGameContext = () => useContext(gameContext);

