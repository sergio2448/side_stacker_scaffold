import React, { useEffect, useState } from 'react'
import CardGame from './CardGame'
import { getApiPath } from './env'

interface Infogame {
  game_id: string;
  player1: string;
  player2: string | null;
}

const Games = () => {

  const [data, setData] = useState([])
  
useEffect(() => {
  api().then(response => setData(response))
}, [])

  const api = async () => {
    try {
      const apiPath = getApiPath();
      //all games
      const info = await fetch(apiPath + '/test')
        .then(response => response.json())
      //games waiting for second player
      const info_final = info.all_games.filter((e: Infogame) => e.player2 === null)
      return info_final
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h1 id="main-title">Games waiting for player2</h1>
       {data &&
        data.map((e: Infogame) => (
        <CardGame
          key={e.game_id}
          game_id={e.game_id}
          player1={e.player1}
        />
      ))}
    </div>
  )
}

export default Games