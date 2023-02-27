import type { NextPage } from 'next'
import { FC, useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { io } from 'socket.io-client'
import ReName from '../components/rename'
export const socket = io('http://localhost:3001')
import * as Flags from 'country-flag-icons/react/3x2'


interface Player {
  id: string;
  name: string;
  points: number;
  guess: boolean;
  correct: boolean;
}

const flag = "UnitedStates";

const Home: NextPage = () => {

  socket.on('server-full', () => {
    alert('Server is full');
  });

  useEffect(() => {
  socket.emit('client-ready')

  socket.on('update-players', (players: Player[]) => {
    console.log(players);
    const playerList = document.getElementById('playerlist') as HTMLElement;
    if (playerList) {
      playerList.innerHTML = '';
      players.forEach((player) => {
        const li = document.createElement('li');
        li.textContent = player.name + ' | ' + player.points;
        playerList.appendChild(li);
      });
    }
  });

  }, [])



  return (
    <>
      <Head>
        <title>Guess The Flag</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='mt-5'>
        <h1 className='text-4xl text-center'>Guess The Flag</h1>
        {/* <ReName /> */}
        

        <div className='grid grid-cols-6 gap-3'>
          <div className='bg-gray-600 text-center rounded-lg max-h-[40rem]'>
            <ul id='playerlist' className=' text-white'></ul>
          </div>
          <div className='col-span-5 bg-amber-300 h-[40rem]'>
            <div className='flex flex-row justify-center'>
              <Flags.{flag} title="United States" className="flag"/>
            </div>
          </div>

        </div>


      </main>
    </>
  )
}

export default Home
