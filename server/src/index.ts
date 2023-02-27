const express = require('express');
import http from 'http';
import { Server, Socket } from 'socket.io';
import { generateRandomName } from './utils';
const maxUsers = 25;

interface Player {
  id: string;
  name: string;
  points: number;
  guess: boolean;
  correct: boolean;
}
const players: Player[] = [];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
  pingTimeout: 120000,
  pingInterval: 5000,
});



io.on('connection', (socket: Socket) => {

  socket.on('client-ready', () => {
    console.log('client ready');
    if (players.length < maxUsers) {
    const newPlayer: Player = { id: socket.id, name: generateRandomName(), points: 0, guess: false, correct: false };
    players.push(newPlayer);
    io.emit('update-players', players);
    } else {
      socket.emit('server-full');
    }
  });

  socket.on('disconnect', () => {
    console.log('client disconnected');
    const disconnectedPlayer :any = players.find((player) => player.id === socket.id);
    const index = players.indexOf(disconnectedPlayer);
    if (index > -1) {
      players.splice(index, 1);
    }
    io.emit('update-players', players);
  });

  socket.on('update-players', () => {
    console.log('update players');
    io.emit('update-players', players);
  });

  socket.on('rename-player', (name: string) => {
    console.log('rename player');
    const player = players.find((player) => player.id === socket.id);
    if (player) {
      player.name = name;
    }
    io.emit('update-players', players);
  });
});

server.listen(3001, () => {
  console.log('✔️ Server listening on port 3001');
});
