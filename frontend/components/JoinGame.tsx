import React, { SyntheticEvent, useCallback, useState } from 'react';
import { GameId, PlayerName } from './types';
import useSetGame from "./useSetGame";

const setGame = useSetGame()

const JoinGame = ({game_id}) => {

  const redirectToGame = setGame.useRedirectToGame();
  const [unForExistingGame, setUnForExistingGame] = useState("");
  const [idOfExistingGame, setIdOfExistingGame] = useState(game_id);
  
  console.log(idOfExistingGame)
  const handleRedirectToGame = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      redirectToGame(idOfExistingGame as GameId, unForExistingGame as PlayerName);
    },
    [unForExistingGame, idOfExistingGame, redirectToGame]
  );

  return (
    <div className="home-actions">
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
            {!game_id && <input
              type="text"
              className="form-control"
              placeholder="Game ID"
              name="game_key"
              id="game-key"
              value={idOfExistingGame}
              onChange={(e) => setIdOfExistingGame(e.target.value)}
            />}
          </div>
          <button type="submit">Join Game!</button>
        </form>
    </div>
  )
}

export default JoinGame