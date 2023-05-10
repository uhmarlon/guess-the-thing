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
        <div className='flex justify-center mb-6'>
            <div className='grid grid-cols-4 gap-3'>
              <div className='col-span-3'>
                <h1 className='text-4xl'>5</h1>
              </div>
            <div className=''>
              <h1 
              className='text-3xl'
              >5 sec</h1>
            </div>
          </div>
        </div>
        <div className='flex justify-center mb-4'>
          <input
            type="text"
            name="Eingabe"
            placeholder="Land eingeben"

            // onKeyDown={handleKeyDown}
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

export default gussthecocktail