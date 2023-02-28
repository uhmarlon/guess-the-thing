const express = require('express');
import http from 'http';
import { Server, Socket } from 'socket.io';
import { generateRandomName, makeid } from './utils';
import { gameLoops } from './game';
const maxUsers = 25;

export interface Player {
  id: string;
  name: string;
  points: number;
  room: string;
  guess: boolean;
  correct: boolean;
}
export const players: Player[] = [];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
  pingTimeout: 120000,
  pingInterval: 5000,
});

const clientRooms: { [key: string]: string } = {};
interface Room {
  sockets: Set<Socket>;
}
const state: { [key: string]: Room } = {};


io.on('connection', (socket: Socket) => {
  socket.on('newGame', handleNewGame);
  socket.on('joinGame', handleJoinGame);
  socket.on('clientReady', handleClientReady);
  socket.on('cgameStart', handleGameStart);
  socket.on('disconnect', () => {
    removePlayer(socket);
  });
  socket.on('getPlayerinRoom', getPlayersInRoom);

  function handleJoinGame(roomName: string) {
    const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
    if (room) {
      clientRooms[socket.id] = roomName;
      socket.join(roomName);
      socket.emit('gameCodeoc', roomName);
    } else {
      socket.emit('unknownCode');
    }
  }

  function handleNewGame() {
    let roomName = makeid(5);
    clientRooms[socket.id] = roomName;
    socket.emit('gameCode', roomName);
    socket.join(roomName);
  }

  function handleClientReady() {
    const roomName = clientRooms[socket.id];
    if (!roomName) {
      return;
    }
    const player = createPlayer(roomName as string, socket.id);
    io.to(roomName).emit('update-players', getPlayersInRoom(roomName));
  }

  function removePlayer(socket: Socket) {
    console.log('remove player');
    const roomName = clientRooms[socket.id];
    if (!roomName) {
      return;
    }
    socket.leave(roomName);
    const playerIndex = players.findIndex((player) => {
      return player.id === socket.id;
    });
    if (playerIndex !== -1) {
      players.splice(playerIndex, 1);
    }
    io.to(roomName).emit('update-players', getPlayersInRoom(roomName));
  }

  function getPlayersInRoom(roomName: string) {
    const playersInRoom = players.filter((player) => player.room === roomName);
    return playersInRoom;
  }

  function handleGameStart() {
    const roomName = clientRooms[socket.id];
    if (!roomName) {
      return;
    }
    const playersInRoom = getPlayersInRoom(roomName);
    if (playersInRoom.length < 2) {
      return;
    }
    io.to(roomName).emit('gameStarted');
    gameLoops(roomName);
  }

  socket.on('rename-player', (name: string) => {
    const roomName = clientRooms[socket.id];
    const player = players.find((player) => player.id === socket.id);
    if (player) {
      player.name = name;
    }
    io.to(roomName).emit('update-players', getPlayersInRoom(roomName));
  });

});

server.listen(3001, () => {
  console.log('✔️ Server listening on port 3001');
});

function createPlayer(roomName: string, socketId: any) {
  const id = socketId;
  const name = generateRandomName();
  const player: Player = {
  id,
  name,
  points: 0,
  guess: false,
  correct: false,
  room: roomName,
  };
  players.push(player);
  return player;
}

export async function gameCountdown(roomName: string, timer: number): Promise<void> {
  const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
  if (!room) {
    return Promise.reject('Room does not exist');
  }
  let counter = timer;
  const countdownInterval = setInterval(() => {
    counter--;
    io.to(roomName).emit('gameCountdown', counter);
    if (counter === 0) {
      clearInterval(countdownInterval);
      return Promise.resolve('stop');
    }
  }, 1000);
}

export async function gameSetFlag(roomName: string, flagKey: string): Promise<void> {
  const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
  if (!room) {
    return Promise.reject('Room does not exist');
  }
  io.to(roomName).emit('gameSetFlag', flagKey);
}

export async function gameSetRoomString(roomName: string, roomString: string): Promise<void> {
  const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
  if (!room) {
    return Promise.reject('Room does not exist');
  }
  io.to(roomName).emit('gameSetroomString', roomString);
}