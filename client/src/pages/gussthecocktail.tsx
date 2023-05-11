import type { NextPage } from 'next'
import { FC, useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { io } from 'socket.io-client'
import { socket } from './gusstheflag'
import Gamejoincreate from '../components/Gamejoin'
import Lobby from '../components/Lobby'
import { useRouter } from 'next/router'
import { useLobby, useGameToken } from '../utils/game'


export const gussthecocktail: NextPage = () => {

return (
    <>
      <Head>
        <title>Guess The Flag</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* {!inLobby ? ( <Gamejoincreate /> ) : (
         <Lobby gameToken={gameToken} startbutton={gameCreator} /> 
      )} */}

      <main className='mt-28'>
        <h1 className='text-4xl text-center mb-2'>Guess The Cocktail</h1>
        <h2 className='text-1xl text-center mb-2'>Runde: 5/5</h2>
        <div className='flex justify-center mb-6'>
              <Image
                src="https://www.thecocktaildb.com/images/media/drink/nkwr4c1606770558.jpg"
                alt="Picture of the author"
                width={350}
                height={350}
                className='rounded-xl'
                />
        </div>
        <div className='flex justify-center mb-1'>
          <h1 className='text-4xl'>Cocktailname</h1>
        </div>
        <div className='flex justify-center mb-6'>
          <h1 className='text-1xl'>4 Sekunden</h1>
        </div>
        <div className='flex justify-center mb-4'>
        <div className='grid grid-cols-2 gap-3 text-lg'>
          <button className='bg-gray-600 text-white text-center rounded-lg w-72 h-14'>Old Fashioned</button>
          <button className='bg-gray-600 text-white text-center rounded-lg w-72 h-14'>Old Fashioned</button>
          <button className='bg-gray-600 text-white text-center rounded-lg w-72 h-14'>Old Fashioned</button>
          <button className='bg-gray-600 text-white text-center rounded-lg w-72 h-14'>Old Fashioned</button>
        </div>



        
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