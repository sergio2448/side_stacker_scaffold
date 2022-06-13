import Link from 'next/link'
import React, {useState} from 'react';
import NewGame from "./NewGame";
import JoinGame from "./JoinGame";
import Modal from './Modal';

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false)
  return (
    <div className="App">
      <h1 id="main-title">Sides Stacker</h1>
      <div className="home-actions">
        <div className="join-game">
        <button onClick={openModal}>Create/Join Game</button>
        <Modal isOpen={isOpen} closeModal={closeModal}>
          <NewGame />
            <p>-- or --</p>
          <JoinGame />
        </Modal>
          <Link href='/list_games'><button>Games in progress!</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
