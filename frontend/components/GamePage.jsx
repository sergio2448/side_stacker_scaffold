import { useRouter } from "next/router";
import styled from "styled-components";
import { ReactStacker } from "./ReactStacker";
import { WebSocketContextProvider } from "./WebSocketContext";
import { GameContextProvider } from "./GameContext";
import { PlainJsStacker } from "./PlainJsStacker";

const GamePageWrapper = styled.div`
  display: flex;
`;

export const GamePage = () => {
  const router = useRouter()
  const { gameId, playerName } = router.query
  if (!gameId) {
    return <div>No game id</div>;
  }
  if (!playerName) {
    return <div>No player name</div>;
  }
  return (
    <GamePageWrapper>
      <WebSocketContextProvider>
        <PlainJsStacker gameId={gameId} playerName={playerName} />
        <GameContextProvider>
          <ReactStacker gameId={gameId} playerName={playerName} />
        </GameContextProvider>
      </WebSocketContextProvider>
    </GamePageWrapper>
  );
}