import React, { SyntheticEvent, useCallback, useState } from 'react';
import { PlayerName } from './types';
import useSetGame from "./useSetGame";

const NewGame = () => {
  const setGame = useSetGame()
  const [unForNewGame, setUnForNewGame] = useState("");
  const joinGame = setGame.useJoinGame();

  const handleJoinGameSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      await joinGame(unForNewGame as PlayerName);
    },
    [joinGame, unForNewGame]
  );
  return (
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
    </div>
  )
}

export default NewGame