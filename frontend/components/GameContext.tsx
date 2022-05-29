import { createContext, ReactNode, RefObject, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { BOARD_COLUMNS, BOARD_ROWS, EVENT_TYPE_ERROR, EVENT_TYPE_PLAY, EVENT_TYPE_WIN, SIDE_RIGHT } from './constants';
import { useWebSocket } from './WebSocketContext';
import { ApiEvent, EventType, Game, GameId, PlayerColor, PlayerName, Side, Y } from './types';

interface WithSetGame {
  setGame: (g: Game) => void;
}

interface WithGameRef {
  gameRef: RefObject<Game>;
}

export function showMessage(message: string) {
  window.setTimeout(() => window.alert(message), 50);
}

const initEmpty = () =>
  Array(BOARD_ROWS)
    .fill(null)
    .map(() => Array(BOARD_COLUMNS).fill(null));

// would "playback" a singular move
const usePlayMove = ({ setGame, gameRef }: WithSetGame & WithGameRef) =>
  useCallback(
    (playerColor: PlayerColor, move: [string, Side]) => {
      const game = gameRef.current!; // shadow state
      const y = parseInt(move[0], 10);
      const row = game[y];
      const side = move[1];
      const rowForSearch = [...row];
      if (side === SIDE_RIGHT) rowForSearch.reverse();
      const x_ = rowForSearch.findIndex((p) => !p);
      if (x_ === -1) throw new RangeError(`Row is full`);
      const x = side === SIDE_RIGHT ? row.length - 1 - x_ : x_; // reverse back
      // throw new RangeError(`row must be between 0 and ${BOARD_ROWS}.`);
      // throw new RangeError(`column must be between 0 and ${BOARD_COLUMNS}.`);
      const game_ = [...game.map((r) => [...r])];
      game_[y][x] = playerColor;
      setGame(game_);
    },
    [setGame, gameRef]
  );

const useReceiveMoves = ({ setGame, gameRef }: WithSetGame & WithGameRef) => {
  const webSocket = useWebSocket();
  const playMove = usePlayMove({ setGame, gameRef });
  return useCallback(() => {
    const listener = ({ data }: { data: string }) => {
      const event = JSON.parse(data) as ApiEvent;
      switch (event.type) {
        // TODO check exhaustive check works
        case EVENT_TYPE_PLAY:
          // Update the UI with the move.
          playMove(event.player_color, event.movement);
          break;
        case EVENT_TYPE_WIN:
          showMessage(`Player ${event.player} wins!`);
          // No further messages are expected; close the WebSocket connection.
          webSocket.close(1000);
          break;
        case EVENT_TYPE_ERROR:
          showMessage(event.message);
          break;
        default:
          throw new Error(`Unsupported event type: ${event.type}.`);
      }
    };
    webSocket.addEventListener("message", listener);
    return () => webSocket.removeEventListener("message", listener);
  }, [webSocket, playMove]);
};

const useMove = () => {
  const webSocket = useWebSocket();
  return useCallback(
    (playerName: PlayerName, row: Y, side: Side) => {
      const event = {
        type: "play",
        username: playerName,
        movement: `${row}${side}`,
      };
      webSocket.send(JSON.stringify(event));
    },
    [webSocket]
  );
};

function joinGame(websocket: WebSocket, gameId: GameId, playerName: PlayerName) {
  const listener = () => {
    const event = { type: "join", game_key: gameId, username: playerName };
    websocket.send(JSON.stringify(event));
  };
  websocket.addEventListener("open", listener);
  return () => websocket.removeEventListener("open", listener);
}

const useJoin = ({ setGame, gameRef }: WithSetGame & WithGameRef) => {
  const webSocket = useWebSocket();
  const receiveMoves = useReceiveMoves({ setGame, gameRef });
  return useCallback(
    (gameId: GameId, playerName: PlayerName) => {
      const stopListeningJoin = joinGame(webSocket, gameId, playerName);
      const stopReceivingMoves = receiveMoves();
      return () => {
        stopListeningJoin();
        stopReceivingMoves();
        setGame(initEmpty());
      };
    },
    [webSocket, receiveMoves, setGame]
  );
};

export interface GameContext {
  game: Game;
  join: (gameId: GameId, playerName: PlayerName) => () => void;
  move: (playerName: PlayerName, row: Y, side: Side) => void;
}

const gameContext = createContext<GameContext>(null as any as GameContext/*guaranteed to be there*/);
export const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const [game, setGame_] = useState(initEmpty);
  const gameRef = useRef(game); // don't reload join() a lot
  const setGame = useCallback((game: Game) => {
    setGame_(game);
    gameRef.current = game;
  }, []);
  const move = useMove();
  const join = useJoin({ setGame, gameRef });
  const api = useMemo(
    () => ({
      game,
      join,
      move,
    }),
    [game, join, move]
  );
  return <gameContext.Provider value={api}>{children}</gameContext.Provider>;
};
export const useGameContext = () => useContext(gameContext);
