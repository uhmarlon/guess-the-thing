import type { NextPage } from 'next'
import { FC, useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { io } from 'socket.io-client'
import { CountryFlag } from '../components/Flag'
export const socket = io('http://localhost:3001')
import * as Flags from 'country-flag-icons/react/3x2'
import Gamejoincreate from '../components/Gamejoin'
import Lobby from '../components/Lobby'


export interface Player {
  id: string;
  name: string;
  points: number;
  guess: boolean;
  correct: boolean;
}


const Home: NextPage = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [flagKey, setflagKey] = useState("DE");
  const [countryTitel, setcountryTitel] = useState("Germany");

  const [gameToken, setgameToken] = useState("DE");

  const [gameCreator , setGameCreator] = useState<boolean>(false);

  const [inGame, setInGame] = useState<boolean>(false);
  const [inLobby, setinLobby] = useState<boolean>(false);

  useEffect(() => {
    socket.on("gameCode", (gameCode) => {
      setinLobby(true);
      setGameCreator(true);
      setgameToken(gameCode);
      socket.emit('clientReady')
    });
    socket.on("gameCodeoc", (gameCode) => {
      setinLobby(true);
      setgameToken(gameCode);
      socket.emit('clientReady')
    });

    socket.on("gameStarted", () => {
      setInGame(true);
    });

    socket.on("gameCountdown", (timeLeft) => {
      setTimeLeft(timeLeft);
    });

    socket.on("gameSetFlag", (flagKey) => {
      setflagKey(flagKey);
    });

    socket.on("gameSetroomString", (roomString) => {
      setcountryTitel(roomString);
      console.log(roomString);
    });

    socket.on('update-players', (players: Player[]) => {
      console.log(players);
      const playerList = document.getElementById('playerlistgame') as HTMLElement;
      if (playerList) {
        playerList.innerHTML = '';
        players.sort((a, b) => b.points - a.points);
        players.forEach((player) => {
          const li = document.createElement('li');
          li.textContent = player.name + " | " + player.points;
          playerList.appendChild(li);
        });
      }
    });

  }, []);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      socket.emit("pickString", e.currentTarget.value, timeLeft);
      e.currentTarget.value = "";
    }
  };

  return (
    <>
      <Head>
        <title>Guess The Flag</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!inLobby ? ( <Gamejoincreate /> ) : (
         <Lobby gameToken={gameToken} startbutton={gameCreator} /> 
      )}

      <main className='mt-28'>
      {/* <ReName /> */}
        <h1 className='text-4xl text-center mb-5'>Guess The Flag</h1>
        <div className='flex justify-center mb-6'>
              <CountryFlag flagKey={flagKey} size={350} />
        </div>
        <div className='flex justify-center mb-6'>
            <div className='grid grid-cols-4 gap-3'>
              <div className='col-span-3'>
                <h1 className='text-4xl'>{countryTitel}</h1>
              </div>
            <div className=''>
              <h1 
              className='text-4xl'
              >{timeLeft} sec</h1>
            </div>
          </div>
        </div>
        <div className='flex justify-center mb-4'>
          <input
            type="text"
            name="Eingabe"
            placeholder="Land eingeben"

            onKeyDown={handleKeyDown}
            className="px-3 py-3 text-white border rounded-lg bg-gray-800 border-gray-600 w-72 focus:border-blue-500 focus:outline-none focus:ring"
          />
        </div>
        <div className='flex justify-center mb-1'>
          <h1 className='text-2xl'>Spieler</h1>
        </div>

        <div className='flex justify-center mb-4'>
          <div className='bg-gray-600 text-center rounded-lg w-72'>
            <ul id='playerlistgame' className=' text-white'></ul>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
