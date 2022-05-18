import { useRouter } from "next/router";
import { PlainJsStacker } from "./PlainJsStacker";

export const Game = () => {
  const router = useRouter()
  const { gameId, playerName } = router.query
  if (!gameId) {
    return <div>No game id</div>;
  }
  if (!playerName) {
    return <div>No player name</div>;
  }
  return (
    <PlainJsStacker gameId={gameId} playerName={playerName} />
  );
}