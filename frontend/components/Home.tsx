import { useRouter } from "next/router";
import React, { SyntheticEvent, useCallback, useState } from 'react';
import { getApiPath } from "./env";
import { GameId, PlayerName } from './types';

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

function Home() {
  const redirectToGame = useRedirectToGame();
  const [unForNewGame, setUnForNewGame] = useState("");
  const [unForExistingGame, setUnForExistingGame] = useState("");
  const [idOfExistingGame, setIdOfExistingGame] = useState("");
  const joinGame = useJoinGame();
  const handleJoinGameSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      await joinGame(unForNewGame as PlayerName);
    },
    [joinGame, unForNewGame]
  );
  const handleRedirectToGame = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      redirectToGame(idOfExistingGame as GameId, unForExistingGame as PlayerName);
    },
    [unForExistingGame, idOfExistingGame, redirectToGame]
  );
  return (
    <div className="App">
      <h1 id="main-title">Side Stacker</h1>
      <div className="home-actions">
        <form className="join-game" onSubmit={handleJoinGameSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              name="username"
              value={unForNewGame}
              onChange={(e) => setUnForNewGame(e.target.value)}
            />
            <button type="submit" className="start-game">
              Start New Game
            </button>
          </div>
        </form>
        <p>-- or --</p>
        <form className="join-game" onSubmit={handleRedirectToGame}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              name="username"
              id="username"
              value={unForExistingGame}
              onChange={(e) => setUnForExistingGame(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Game ID"
              name="game_key"
              id="game-key"
              value={idOfExistingGame}
              onChange={(e) => setIdOfExistingGame(e.target.value)}
            />
          </div>
          <button type="submit">Join Game!</button>
        </form>
      </div>
    </div>
  );
}

export default Home;
