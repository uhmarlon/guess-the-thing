import {
  gameMeta,
  gameSetPersonString,
  gameSetRound,
  getPlayersInRoom,
  getPlayersPoints,
  io,
} from "../../app";
interface FlagData {
  [key: string]: string;
}

import flags_de from "../../data/flags/de_de.json";
import flags_en from "../../data/flags/en_us.json";
import { Room, RoomGameMetadata } from "../../interfaces/interfaces";
import { buildHiddenName, generateRandomName } from "../../utils/utils";
const typedFlags: FlagData = flags_de;

export async function gameLoop(
  roomName: string,
  rounds: number,
): Promise<void> {
  gameSetRoomString(roomName, "Get ready!");
  await new Promise((resolve) => {
    let outTimer = 3;
    const countdownInterval = setInterval(() => {
      outTimer--;
      let [randomKey, countryString] = getRandomFlag();
      gameSetFlag(roomName, randomKey);
      io.to(roomName).emit("gameCountdown", outTimer);
      if (outTimer === 0) {
        clearInterval(countdownInterval);
        resolve("stop");
      }
    }, 1000);
  });
  gameCountdown(roomName, 15, rounds);
}

export function getRandomFlag(): [string, string] {
  const keys: string[] = Object.keys(typedFlags);
  const randomKey: string = keys[Math.floor(Math.random() * keys.length)];
  const randomFlag: string = typedFlags[randomKey];
  return [randomKey as string, randomFlag as string];
}

export async function gameCountdown(
  roomName: string,
  timer: number,
  rounds: number,
): Promise<void> {
  const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
  const roomMeta = gameMeta.find((room) => room.roomName === roomName);
  const [randomKey, countryString] = getRandomFlag();

  if (!roomMeta) {
    const newRoomMeta: RoomGameMetadata = {
      roomName,
      game: "flag",
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
      io.to(roomName).emit("gameEnd", getPlayersPoints(roomName));
      return;
    }
    roomMeta.countryString = countryString;
    roomMeta.round++;
    gameMeta.push(roomMeta);
    gameSetRound(roomName, roomMeta.round, roomMeta.maxRounds);
  }

  gameSetRoomString(roomName, buildHiddenName(countryString));
  gameSetFlag(roomName, randomKey);
  io.to(roomName).emit("gameSetFlag", randomKey);
  let counter = timer + Math.round((countryString.length / 4) * 0.5); //Anything other than USA will get extra time.
  await new Promise((resolve) => {
    const countdownInterval = setInterval(() => {
      const playersInRoom = getPlayersInRoom(roomName);
      const allGuessed = playersInRoom.every(
        (player: { guess: boolean }) => player.guess === true,
      );
      if (allGuessed) {
        clearInterval(countdownInterval);
        resolve("stop");
      }
      counter--;
      io.to(roomName).emit("gameCountdown", counter);
      if (counter === 0) {
        clearInterval(countdownInterval);
        resolve("stop");
      }
    }, 1000);
  });
  if (roomMeta) {
    roomMeta.countryString = generateRandomName();
    gameMeta.push(roomMeta);
  }
  const playersInRoom = getPlayersInRoom(roomName);
  playersInRoom.forEach((player: { guess: boolean }) => {
    player.guess = false;
  });
  io.to(roomName).emit("update-players", playersInRoom);
  gameSetRoomString(roomName, countryString);
  await new Promise((resolve) => {
    let outTimer = 5;
    const countdownInterval = setInterval(() => {
      outTimer--;
      io.to(roomName).emit("gameCountdown", outTimer);
      if (outTimer === 0) {
        clearInterval(countdownInterval);
        resolve("stop");
      }
    }, 1000);
  });
  gameCountdown(roomName, 15, rounds);
}

export async function gameSetFlag(
  roomName: string,
  flagKey: string,
): Promise<void> {
  const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
  if (!room) {
    return;
  }
  io.to(roomName).emit("gameSetFlag", flagKey);
}

export async function gameSetRoomString(
  roomName: string,
  roomString: string,
): Promise<void> {
  const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
  if (!room) {
    return;
  }
  io.to(roomName).emit("gameSetroomString", roomString);
}
