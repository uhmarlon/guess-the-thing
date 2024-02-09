import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Player } from './gusstheflag'
import Gamejoincreate from '../components/Gamejoin'
import Lobby from '../components/Lobby'
import { useRouter } from 'next/router'
import { useLobby, useGameToken } from '../utils/game'
import CocktailButtons from '../components/CocktailButtons'
import {socket} from '../core/gameSocket'


export const gussthecocktail: NextPage = () => {
  const router = useRouter()

  const { inLobby, setinLobby } = useLobby()
  const { gameToken, setgameToken } = useGameToken()

  const [timeLeft, setTimeLeft] = useState(0);
  const [gameRounds, setgameRounds] = useState(0);
  const [maxGameRounds, setmaxGameRounds] = useState(0);
  const [cocktailtitel, setCocktailtitel] = useState<string>("");
  const [cocktailIMG, setCocktailIMG] = useState<string>("https://www.thecocktaildb.com/images/media/drink/nkwr4c1606770558.jpg");
  const [drinkInfo, setDrinkInfo] = useState([{strDrink:'California Lemonade',idDrink:'11205'},{strDrink:'Bloody Maria',idDrink:'11112'},{strDrink:'Alexander',idDrink:'11014'},{strDrink:'Gin Toddy',idDrink:'11420'}]);

  const [gameCreator , setGameCreator] = useState<boolean>(false);
  const [inGame, setInGame] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<boolean>(false);

  useEffect(() => {
    // button click console log key 


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

    socket.on("gameSetroomString", (roomString) => {
      setCocktailtitel(roomString);
    });

    socket.on("gameRounds", (gameRounds, maxRounds) => {
      setgameRounds(gameRounds);
      setmaxGameRounds(maxRounds);
    });
    socket.on("gameCountdown", (timeLeft) => {
      setTimeLeft(timeLeft);
    });

    socket.on("gameActivButton", (button) => {
      setActiveButton(button);
    });

    socket.on("gameSetCocktails", (clientDrinkInfo) => {
      setDrinkInfo(clientDrinkInfo);
    });

    socket.on("gameSetCocktailsIMG", (strDrinkThumb) => {
      setCocktailIMG(strDrinkThumb);
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

return (
    <>
      <Head>
        <title>Guess The Flag</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!inLobby ? ( <Gamejoincreate gameType="cocktail" /> ) : (
         <Lobby gameToken={gameToken} startbutton={gameCreator} /> 
      )}

      <main className='mt-28'>
        <h1 className='text-4xl text-center mb-2'>Guess The Cocktail</h1>
        <h2 className='text-1xl text-center mb-2'>Runde: {gameRounds}/{maxGameRounds}</h2>
        <div className='flex justify-center mb-6'>
              <Image
                src={cocktailIMG}
                alt="Picture of the Cocktail"
                width={350}
                height={350}
                className='rounded-xl'
                />
        </div>
        <div className='flex justify-center mb-1'>
          <h1 className='text-4xl'>{cocktailtitel}</h1>
        </div>
        <div className='flex justify-center mb-6'>
          <h1 className='text-1xl'>{timeLeft} Seconds</h1>
        </div>
        <div className='flex justify-center mb-4'>
          <CocktailButtons active={activeButton} cocktailArray={drinkInfo} />
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

export default gussthecocktail