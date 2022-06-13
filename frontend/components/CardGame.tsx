import React from 'react'
import JoinGame from './JoinGame'

const CardGame = ({game_id, player1}) => {
  return (
    <div key={game_id} className="container mt-5">
      <hr/>
      <div className="row">
        <div className="col-8">
          <h4 className="text-center">Game-host</h4>
          <ul className="list-group">
            <li className="list-group-item">
              <span className="lead">{player1}</span>
            </li>
          </ul>
        </div>
        <div className="col-4">
          <JoinGame game_id={game_id}/>
        </div>
      </div>
    </div>
  )
}

export default CardGame