import React, {useCallback, useState} from 'react';
import { Component1 } from "./Component1";
import { Component2 } from "./Component2";
import {getApiPath} from "./env";
import {useNavigate} from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const redirectToGame = useCallback((gameId, gameUserName) => {
    navigate(`/game/${gameId}/${gameUserName}`);
  }, [navigate]);
  const [unForNewGame, setUnForNewGame] = useState("");
  const [unForExistingGame, setUnForExistingGame] = useState("");
  const [idOfExistingGame, setIdOfExistingGame] = useState("");
  const handleJoinGameSubmit = useCallback(async (e) => {
    e.preventDefault(); // TODO can add bug here
    const apiPath = getApiPath();
    const formData = new FormData();
    formData.append("username", unForNewGame);
    const r = await fetch(apiPath + "/create-game", {
      method: "POST",
      body: formData
    });
    if (!r.ok) alert((await r.text()))
    const gameId = (await r.json()).game_key;
    redirectToGame(gameId, unForNewGame);
  }, [unForNewGame, redirectToGame]);
  const handleRedirectToGame = useCallback(async (e) => {
    e.preventDefault();
    redirectToGame(idOfExistingGame, unForExistingGame);
  }, [unForExistingGame, idOfExistingGame]);
  return (
    <div className="App">
      <Component1 hello="jsx" />
      <Component2 hello="tsx" />
      <h1 id="main-title">Side Stacker</h1>
      <div className="home-actions">
        <form className="join-game" onSubmit={handleJoinGameSubmit}>
          <div className="form-group">
            <input type="text" className="form-control" placeholder="Username" name="username" value={unForNewGame} onChange={(e) => setUnForNewGame(e.target.value)}/>
            <button type="submit" className="start-game">Start New Game</button>
          </div>
        </form>
        <p>-- or --</p>
        <form className="join-game" onSubmit={handleRedirectToGame}>
          <div className="form-group">
            <input type="text" className="form-control" placeholder="Username" name="username" id="username" value={unForExistingGame} onChange={(e) => setUnForExistingGame(e.target.value)}/>
            <input type="text" className="form-control" placeholder="Game ID" name="game_key" id="game-key" value={idOfExistingGame} onChange={(e) => setIdOfExistingGame(e.target.value)}/>
          </div>
          <button type="submit">Join Game!</button>
        </form>
      </div>
    </div>
  );
}

export default Home;
