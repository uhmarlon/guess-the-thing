const express = require('express');
import http from 'http';
import { Server, Socket } from 'socket.io';
import { generateRandomName, makeid, buildHiddenName} from './utils';
import { gameLoop, getRandomFlag } from './game';
import { arrayBuffer } from 'stream/consumers';

const app = express();
const server = http.createServer(app);
export const players: Player[] = [];
export const gameMeta: RoomGameMetadata[] = [];
const clientRooms: { [key: string]: { gameType: string, roomName: string } } = {};


// const clientRooms with gameType and  roomName

export interface Player {
  id: string;
  name: string;
  points: number;
  room: string;
  guess: boolean;
  correct: boolean;
}
export interface RoomGameMetadata {
  roomName: string;
  game: string
  countryString: string;
  round: number;
  maxRounds: number;
}

interface Room {
  sockets: Set<Socket>;
}

export const io = new Server(server, {
  cors: {
    origin: ['https://guessthething.vercel.app', 'http://localhost:3000'],
  },
  pingTimeout: 120000,
  pingInterval: 5000,
});


function getPlayersInRoom(roomName: string): Player[] {
  const playersInRoom = players.filter((player) => player.room === roomName);
  return playersInRoom;
}


io.on('connection', (socket: Socket) => {
  socket.on('newGame', handleNewGame);
  socket.on('joinGame', handleJoinGame);
  socket.on('clientReady', handleClientReady);
  socket.on('cgameStart', handleGameStart);
  socket.on('pickString', handlepickString);
  socket.on('disconnect', () => { removePlayer(socket); });
  socket.on('getPlayerinRoom', getPlayersInRoom);

  function handleJoinGame(roomName: string, gameType: string) {
    const room = io.sockets.adapter.rooms.get(roomName);
    const roomString: string = Array.from(room ?? []).join(', ');
    if (room) {
      const roomInfo = clientRooms[roomString];
      if (roomInfo && roomInfo.gameType === gameType) {
        socket.join(roomName);
        console.log(roomName);
        console.log("test");
        socket.emit('gameCodeoc', roomName);
      } else {
        socket.emit('invalidGameType');
      }} else {
          socket.emit('unknownCode');
    }
  }
  
  function handleNewGame(gameType: string) {
    let roomName = makeid(5);
    clientRooms[socket.id] = { gameType, roomName };
    socket.emit('gameCode', roomName);
    socket.join(roomName);
    console.log(roomName);
  }

  function handleClientReady() {
    const roomName = clientRooms[socket.id];
    if (!roomName) {
      return;
    }
    const player = createPlayer(roomName.roomName as string, socket.id);
    console.log(player + ' is ready');
    io.to(roomName.roomName).emit('update-players', getPlayersInRoom(roomName.roomName));
  }

  // function handleClientReady() {
  //   const roomInfo = clientRooms[socket.id];
  //   console.log(roomInfo);
  //   if (!roomInfo) {
  //     return;
  //   }
  //   const { roomName } = roomInfo;
  //   const player = createPlayer(roomName, socket.id);
  //   io.to(roomName).emit('update-players', getPlayersInRoom(roomName));
  // }

  function removePlayer(socket: Socket) {
    const roomInfo = clientRooms[socket.id];
    if (!roomInfo) {
      return;
    }
    const { roomName } = roomInfo;
    socket.leave(roomName);
    const playerIndex = players.findIndex((player) => player.id === socket.id);
    if (playerIndex !== -1) {
      players.splice(playerIndex, 1);
    }
    io.to(roomName).emit('update-players', getPlayersInRoom(roomName));
  }
  

  function handlepickString(pickWord: string, timer: number) {
    const roomInfo = clientRooms[socket.id];
    if (!roomInfo) {
      return;
    }
    const { roomName } = roomInfo;
    const roomMeta = gameMeta.find((room) => room.roomName === roomName);
    if (!roomMeta) {
      return;
    }
    const playerData = players.find((player) => player.id === socket.id);
    if (playerData) {
      if (playerData.guess) {
        return;
      }
      if (pickWord.toLowerCase() === roomMeta.countryString.toLowerCase()) {
        playerData.points += 10 + timer;
        playerData.guess = true;
        gameSetPersonString(socket.id, roomMeta.countryString + "✔️");
        io.to(roomName).emit('update-players', getPlayersInRoom(roomName));
      } else {
        const newString = buildHiddenName(roomMeta.countryString, pickWord);
        gameSetPersonString(socket.id, newString);
      }
    }
  }
  

  function handleGameStart(rounds: number) {
    const roomInfo = clientRooms[socket.id];
    if (!roomInfo) {
      return;
    }
    const { roomName } = roomInfo;
    io.to(roomName).emit('gameStarted');
    gameLoop(roomName, rounds);
  }
  

  socket.on('rename-player', (name: string) => {
    const roomInfo = clientRooms[socket.id];
    if (!roomInfo) {
      return;
    }
    const { roomName } = roomInfo;
    const player = players.find((player) => player.id === socket.id);
    if (player) {
      player.name = name;
    }
    io.to(roomName).emit('update-players', getPlayersInRoom(roomName));
  });
  

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

export async function gameCountdown(roomName: string, timer: number, rounds: number): Promise<void> {
  const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
  const roomMeta = gameMeta.find((room) => room.roomName === roomName);
  const [randomKey, countryString] = getRandomFlag();

  if (!roomMeta) {
    const newRoomMeta: RoomGameMetadata = {
      roomName,
      game: 'flag',
      countryString: countryString,
      round: 1,
      maxRounds: rounds,
    };
    gameSetRound(roomName, newRoomMeta.round, newRoomMeta.maxRounds);
    gameMeta.push(newRoomMeta);
    gameSetRoomString(roomName, buildHiddenName(countryString));
    gameSetFlag(roomName, randomKey);
  } else {
    if (roomMeta.round === roomMeta.maxRounds) {
      io.to(roomName).emit('gameEnd', getPlayersPoints(roomName));
      return;
    }
    roomMeta.countryString = countryString;
    roomMeta.round++;
    gameMeta.push(roomMeta);
    gameSetRound(roomName, roomMeta.round, roomMeta.maxRounds);
  }

  gameSetRoomString(roomName, buildHiddenName(countryString));
  gameSetFlag(roomName, randomKey);
  io.to(roomName).emit('gameSetFlag', randomKey);
  let counter = timer + Math.round((countryString.length / 4 ) * 0.5); //Anything other than USA will get extra time.
  await new Promise((resolve) => {
    const countdownInterval = setInterval(() => {
      const playersInRoom = getPlayersInRoom(roomName);
      const allGuessed = playersInRoom.every((player: { guess: boolean; }) => player.guess === true);
      if (allGuessed) {
        clearInterval(countdownInterval);
        resolve('stop');
      }
      counter--;
      io.to(roomName).emit('gameCountdown', counter);
      if (counter === 0) {
        clearInterval(countdownInterval);
        resolve('stop');
      }
    }, 1000);
  });
  if (roomMeta) {
    roomMeta.countryString = generateRandomName();
    gameMeta.push(roomMeta);
  }
  const playersInRoom = getPlayersInRoom(roomName);
  playersInRoom.forEach((player: { guess: boolean; }) => {
    player.guess = false;
  });
  io.to(roomName).emit('update-players', playersInRoom);
  gameSetRoomString(roomName, countryString);
  await new Promise((resolve) => {
    let outTimer = 5;
    const countdownInterval = setInterval(() => {
      outTimer--;
      io.to(roomName).emit('gameCountdown', outTimer);
      if (outTimer === 0) {
        clearInterval(countdownInterval);
        resolve('stop');
      }
    }, 1000);
  });
  gameCountdown(roomName, 15, rounds);
}

export async function gameSetFlag(roomName: string, flagKey: string): Promise<void> {
  const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
  if (!room) {
    return
  }
  io.to(roomName).emit('gameSetFlag', flagKey);
}

export async function gameSetRoomString(roomName: string, roomString: string): Promise<void> {
  const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
  if (!room) {
    return
  }
  io.to(roomName).emit('gameSetroomString', roomString);
}

export async function gameSetRound(roomName: string, gameRounds: number, maxRounds: number): Promise<void> {
  const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
  if (!room) {
    return
  }
  io.to(roomName).emit('gameRounds', gameRounds, maxRounds);
}

export async function gameSetPersonString(socketId: string, roomString: string): Promise<void> {
  io.to(socketId).emit('gameSetroomString', roomString);
}

export function getPlayersPoints(roomName: string): Player[] {
  const playersInRoom = players.filter((player) => player.room === roomName);
  playersInRoom.sort((a, b) => b.points - a.points);
  return playersInRoom;
}


server.listen(3001, () => {
  console.log('✔️ Server listening on port 3001');
});