import { useRouter } from "next/router";
import { useCallback } from 'react';
import { getApiPath } from "./env";
import { GameId, PlayerName } from './types';

const useSetGame = () => {
  const useRedirectToGame = () => {
    const router = useRouter();
    return useCallback(
      (gameId: GameId, gameUserName: PlayerName) => {
        router.push(`/game/${gameId}/${gameUserName}`);
      },
      [router]
    );
  };
  
  const useJoinGame = () => {
    const redirectToGame = useRedirectToGame();
    return useCallback(
      async (un: PlayerName) => {
        const apiPath = getApiPath();
        const formData = new FormData();
        formData.append("username", un);
        const r = await fetch(apiPath + "/create-game", {
          method: "POST",
          body: formData,
        });
        if (!r.ok) alert(await r.text());
        const gameId = (await r.json()).game_key;
        redirectToGame(gameId, un);
      },
      [redirectToGame]
    );
  };
  
  return {
    useRedirectToGame,
    useJoinGame
  }
}

export default useSetGame;