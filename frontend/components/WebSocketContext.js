import { createContext, useContext, useRef, useState } from "react";
import { getApiPathWS } from "./env";

const webSocketContext = createContext(null);
const initWs = () => new WebSocket(getApiPathWS());
export const WebSocketContextProvider = ({ children }) => {
  const wsRef = useRef(null);
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
