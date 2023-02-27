const express = require('express');
import http from 'http';
import { Server, Socket } from 'socket.io';

interface Player {
  id: string;
  name: string;
  points: number;
  guess: boolean;
  correct: boolean;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

function generateRandomName(): string {
  const adjectives = ['happy', 'sad', 'angry', 'excited', 'sleepy', 'hungry', 'thirsty'];
  const nouns = ['dog', 'cat', 'bird', 'horse', 'fish', 'lion', 'tiger', 'bear'];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective}-${randomNoun}`;
}




// Initialize player list
const players: Player[] = [];

io.on('connection', (socket: Socket) => {
  socket.on('client-ready', () => {
    console.log('client ready');

    // Add new player to the list
    const newPlayer: Player = { id: socket.id, name: generateRandomName(), points: 0, guess: false, correct: false };
    players.push(newPlayer);

    // Send updated player list to all clients
    io.emit('update-players', players);
  });

  socket.on('disconnect', () => {
    console.log('client disconnected');
    const disconnectedPlayer :any = players.find((player) => player.id === socket.id);
    const index = players.indexOf(disconnectedPlayer);
    if (index > -1) {
      players.splice(index, 1);
    }

    // Send updated player list to all clients
    io.emit('update-players', players);
  });

  socket.on('guess', () => {
    console.log('player guessed');

    // Update player's guess status
    const player = players.find((player) => player.id === socket.id);
    if (player) {
      player.guess = true;
    }

    // Send updated player list to all clients
    io.emit('update-players', players);
  });

  socket.on('correct-guess', () => {
    console.log('player guessed correctly');

    // Update player's correct guess status and points
    const player = players.find((player) => player.id === socket.id);
    if (player) {
      player.correct = true;
      player.points += 1;
    }

    // Send updated player list to all clients
    io.emit('update-players', players);
  });
});

server.listen(3001, () => {
  console.log('✔️ Server listening on port 3001');
});
