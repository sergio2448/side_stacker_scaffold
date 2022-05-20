export const getApiPath = () => {
  return process.env.REACT_APP_API_PATH || "http://localhost:8080";
};

export const getApiPathWS = () => {
  return process.env.REACT_APP_API_PATH_WS || "ws://localhost:8080/game";
};
