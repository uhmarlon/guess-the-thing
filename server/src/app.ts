const express = require("express");
import http from "http";
import { Server, Socket } from "socket.io";
import { generateRandomName, makeid, buildHiddenName, getSocketUrl } from "./utils/utils";
import { gameLoop } from "./games/flagGame/flagGame";
import { Player, RoomGameMetadata, Room } from "./interfaces/interfaces";
import { gameCocktailStart } from "./games/cocktailGame/cocktailGame";

const app = express();
const server = http.createServer(app);
export const players: Player[] = [];
export const gameMeta: RoomGameMetadata[] = [];
const clientRooms: { [key: string]: { gameType: string; roomName: string } } = {};

export const io = new Server(server, {
  cors: {
    origin: ["https://guessthething.vercel.app", "http://localhost:3000", getSocketUrl()],
  },
  pingTimeout: 120000,
  pingInterval: 5000,
});

export function getPlayersInRoom(roomName: string): Player[] {
  const playersInRoom = players.filter((player) => player.room === roomName);
  return playersInRoom;
}

io.on("connection", (socket: Socket) => {
  socket.on("newGame", handleNewGame);
  socket.on("joinGame", handleJoinGame);
  socket.on("clientReady", handleClientReady);
  socket.on("cgameStart", handleGameStart);
  socket.on("pickString", handlepickString);
  socket.on("cocktailguss", handlepickCocktail);
  socket.on("disconnect", () => {
    removePlayer(socket);
  });
  socket.on("getPlayerinRoom", getPlayersInRoom);

  // Main functions
  // Like Lobby and Game Handling
  // Rename etc...

  function handleNewGame(gameType: string) {
    let roomName = makeid(5);
    clientRooms[socket.id] = { roomName, gameType };
    socket.emit("gameCode", roomName);
    socket.join(roomName);
  }

  function handleJoinGame(roomName: string, gameType: string) {
    const room = io.sockets.adapter.rooms.get(roomName);
    const roomString: string = Array.from(room ?? [])[0];

    if (room) {
      if (
        clientRooms.hasOwnProperty(roomString) &&
        clientRooms[roomString].gameType == gameType
      ) {
        clientRooms[socket.id] = { roomName, gameType };
        socket.join(roomName);
        socket.emit("gameCodeoc", roomName);
      } else {
        socket.emit("invalidGameType");
      }
    } else {
      socket.emit("unknownCode");
    }
  }

  // function handleJoinGame(roomName: string, gameType: string) {
  //   const room = io.sockets.adapter.rooms.get(roomName);
  //   const roomString: string = Array.from(room ?? []).join(', ');
  //   if (room) {
  //     console.log("checkroom")
  //     const roomInfo = clientRooms[roomString];
  //     console.log(roomInfo)
  //     if (roomInfo && roomInfo.gameType === gameType) {
  //       clientRooms[roomString] = { roomName: roomName, gameType: gameType};
  //       console.log(roomName + " " + gameType + " " + socket.id + " " + roomString)
  //       socket.join(roomName);
  //       console.log(socket.id);
  //       socket.emit('gameCodeoc', roomName);
  //     } else {
  //       socket.emit('invalidGameType');
  //       console.log('invalidGameType');
  //     }} else {
  //       socket.emit('unknownCode');
  //       console.log('unknownCode')
  //   }
  //   console.log("//////")
  // }

  function handleClientReady() {
    const roomName = clientRooms[socket.id];
    if (!roomName) {
      return;
    }
    const player = createPlayer(roomName.roomName as string, socket.id);
    io.to(roomName.roomName).emit(
      "update-players",
      getPlayersInRoom(roomName.roomName)
    );
  }

  function removePlayer(socket: Socket) {
    const roomName = clientRooms[socket.id];
    if (!roomName) {
      return;
    }
    socket.leave(roomName.roomName);
    const playerIndex = players.findIndex((player) => {
      return player.id === socket.id;
    });
    if (playerIndex !== -1) {
      players.splice(playerIndex, 1);
    }
    io.to(roomName.roomName).emit(
      "update-players",
      getPlayersInRoom(roomName.roomName)
    );
  }

  socket.on("rename-player", (name: string) => {
    const roomInfo = clientRooms[socket.id];
    if (!roomInfo) {
      return;
    }
    const { roomName } = roomInfo;
    const player = players.find((player) => player.id === socket.id);
    if (player) {
      player.name = name;
    }
    io.to(roomName).emit("update-players", getPlayersInRoom(roomName));
  });

  // Game functions

  function handleGameStart(rounds: number) {
    const roomInfo = clientRooms[socket.id];
    if (!roomInfo) {
      return;
    }
    const { roomName } = roomInfo;
    io.to(roomName).emit("gameStarted");

    if (roomInfo.gameType === "flag") {
      gameLoop(roomName, rounds);
    }

    if (roomInfo.gameType === "cocktail") {
      gameCocktailStart(roomName, rounds);
    }
  }

  function handlepickCocktail(pickCocktail: string) {
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
      if (pickCocktail === roomMeta.countryString) {
        playerData.points += 10;
        gameSetPersonString(socket.id, "✔️✔️✔️");
        io.to(roomName).emit("update-players", getPlayersInRoom(roomName));
      } else {
        gameSetPersonString(socket.id, "❌ Wrong Answer ❌");
      }
      playerData.guess = true;
    }
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
        io.to(roomName).emit("update-players", getPlayersInRoom(roomName));
      } else {
        const newString = buildHiddenName(roomMeta.countryString, pickWord);
        gameSetPersonString(socket.id, newString);
      }
    }
  }
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

export async function gameSetRound(
  roomName: string,
  gameRounds: number,
  maxRounds: number
): Promise<void> {
  const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
  if (!room) {
    return;
  }
  io.to(roomName).emit("gameRounds", gameRounds, maxRounds);
}

export async function gameSetPersonString(
  socketId: string,
  roomString: string
): Promise<void> {
  io.to(socketId).emit("gameSetroomString", roomString);
}

export function getPlayersPoints(roomName: string): Player[] {
  const playersInRoom = players.filter((player) => player.room === roomName);
  playersInRoom.sort((a, b) => b.points - a.points);
  return playersInRoom;
}

server.listen(3001, () => {
  console.log("✔️ Server listening on port 3001");
});
