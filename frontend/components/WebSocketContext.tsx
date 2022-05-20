import { createContext, ReactNode, useContext, useRef } from 'react';
import { getApiPathWS } from "./env";

/*correctness is guaranteed by code below using it*/
const guaranteedWebsocket: WebSocket = null as any as WebSocket;

const webSocketContext = createContext<WebSocket>(guaranteedWebsocket);
const initWs = () => new WebSocket(getApiPathWS());
export const WebSocketContextProvider = ({ children }: { children: ReactNode }) => {
  const wsRef = useRef<WebSocket>(guaranteedWebsocket);
  if (!wsRef.current) {
    wsRef.current = initWs();
  }
  return (
    <webSocketContext.Provider value={wsRef.current}>
      {children}
    </webSocketContext.Provider>
  );
};
export const useWebSocket = () => useContext(webSocketContext);
