import { useRouter } from "next/router";
import styled from "styled-components";
import { Stacker } from "./Stacker";
import { WebSocketContextProvider } from "./WebSocketContext";
import { GameContextProvider } from "./GameContext";
import { GameId, PlayerName } from './types';

const GamePageWrapper = styled.div`
  display: flex;
`;

export const GamePage = () => {
  const router = useRouter();
  const { gameId, playerName } = router.query as { gameId: GameId; playerName: PlayerName; };
  if (!gameId) {
    return <div>No game id</div>;
  }
  if (!playerName) {
    return <div>No player name</div>;
  }
  return (
    <GamePageWrapper>
      <WebSocketContextProvider>
        <GameContextProvider>
          <Stacker gameId={gameId} playerName={playerName} />
        </GameContextProvider>
      </WebSocketContextProvider>
    </GamePageWrapper>
  );
};
