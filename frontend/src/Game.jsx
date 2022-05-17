import {useParams} from "react-router-dom";
import {PlainJsStacker} from "./PlainJsStacker";

export const Game = () => {
  const { gameId, playerName } = useParams();
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