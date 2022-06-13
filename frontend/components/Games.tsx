import React, { useEffect, useState } from 'react'
import CardGame from './CardGame'
import { getApiPath } from './env'

const Games = () => {

  const [data, setData] = useState([])
  
useEffect(() => {
  api().then(response => setData(response))
}, [])

  const api = async () => {
    const apiPath = getApiPath();
    const info = await fetch(apiPath + '/test').then(response => response.json())
    const info_final = info.games_key.filter(e => e.player2 === null)
    return info_final
  }

  return (
    <div>
      <h1 id="main-title">Games in progress</h1>
       {data &&
      data.map((e) => (
        <CardGame 
          game_id={e.game_id}
          player1={e.player1}
        />
      ))}</div>
  )
}

export default Games