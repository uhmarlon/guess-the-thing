import type { NextPage } from 'next'
import { FC, useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { io } from 'socket.io-client'
import Rename from '../components/Rename'
export const socket = io('http://localhost:3001')


interface Player {
  id: string;
  name: string;
  points: number;
  guess: boolean;
  correct: boolean;
}

const Home: NextPage = () => {

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
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Test App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{' '}
          <a className="text-blue-600" href="https://nextjs.org">
            Next.js!
          </a>
        </h1>


        <Rename />
        
        <ul id='playerlist'>
        </ul>

      </main>
    </div>
  )
}

export default Home
