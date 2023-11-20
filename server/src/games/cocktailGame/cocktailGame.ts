import cocktail from "../../data/cocktail/cocktail.json";
import { Cocktail, Room, RoomGameMetadata } from "../../interfaces/interfaces";
import {
  gameMeta,
  gameSetPersonString,
  gameSetRound,
  getPlayersInRoom,
  getPlayersPoints,
  io,
} from "../../app";
import { gameSetRoomString } from "../flagGame/flagGame";

export async function gameCocktailStart(
  roomName: string,
  rounds: number
): Promise<void> {
  gameSetRoomString(roomName, "Get ready!");
  await new Promise((resolve) => {
    let outTimer = 3;
    const countdownInterval = setInterval(() => {
      outTimer--;
      io.to(roomName).emit("gameCountdown", outTimer);
      if (outTimer === 0) {
        clearInterval(countdownInterval);
        resolve("stop");
      }
    }, 1000);
  });
  gameCocktailLoop(roomName, rounds);

  // let rightCocktail = getRandomCocktail();
  // const randomCocktail = treeRandomDisCocktails(rightCocktail.idDrink);
  // const clientDrinkInfo = [];

  // clientDrinkInfo.push({
  //     strDrink: rightCocktail.strDrink,
  //     idDrink: rightCocktail.idDrink,
  // });
  // for (let i = 0; i < randomCocktail.length; i++) {
  //     clientDrinkInfo.push(randomCocktail[i]);
  // }
  // clientDrinkInfo.sort(() => Math.random() - 0.5);

  // gameSetCocktails(roomName, clientDrinkInfo)
}

export async function gameCocktailLoop(
  roomName: string,
  rounds: number
): Promise<void> {
  const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
  const roomMeta = gameMeta.find((room) => room.roomName === roomName);
  gameSetRoomString(roomName, "");
  io.to(roomName).emit("gameActivButton", true);
  /////////
  const rightCocktail = getRandomCocktail();
  const randomCocktail = treeRandomDisCocktails(rightCocktail.idDrink);
  const clientDrinkInfo = [];

  clientDrinkInfo.push({
    strDrink: rightCocktail.strDrink,
    idDrink: rightCocktail.idDrink,
  });
  for (let i = 0; i < randomCocktail.length; i++) {
    clientDrinkInfo.push(randomCocktail[i]);
  }
  clientDrinkInfo.sort(() => Math.random() - 0.5);
  //////

  if (!roomMeta) {
    const newRoomMeta: RoomGameMetadata = {
      roomName,
      game: "cocktail",
      countryString: rightCocktail.idDrink,
      round: 1,
      maxRounds: rounds,
    };
    gameSetRound(roomName, newRoomMeta.round, newRoomMeta.maxRounds);
    gameMeta.push(newRoomMeta);
  } else {
    if (roomMeta.round === roomMeta.maxRounds) {
      io.to(roomName).emit("gameEnd", getPlayersPoints(roomName));
      return;
    }
    roomMeta.round++;
    roomMeta.countryString = rightCocktail.idDrink;
    gameMeta.push(roomMeta);
    gameSetRound(roomName, roomMeta.round, roomMeta.maxRounds);
  }

  gameSetCocktailIMG(roomName, rightCocktail.strDrinkThumb);
  gameSetCocktails(roomName, clientDrinkInfo);
  // io.to(roomName).emit('gameActivButton', false);
  let counter = 10;
  await new Promise((resolve) => {
    const countdownInterval = setInterval(() => {
      const playersInRoom = getPlayersInRoom(roomName);
      const allGuessed = playersInRoom.every(
        (player: { guess: boolean }) => player.guess === true
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
  io.to(roomName).emit("gameActivButton", false);
  const playersInRoom = getPlayersInRoom(roomName);
  playersInRoom.forEach((player: { guess: boolean }) => {
    player.guess = false;
  });
  io.to(roomName).emit("update-players", playersInRoom);
  gameSetRoomString(roomName, rightCocktail.strDrink);
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
  gameCocktailLoop(roomName, rounds);
}

export async function gameSetCocktails(
  roomName: string,
  clientDrinkInfo: { strDrink: string; idDrink: string }[]
): Promise<void> {
  const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
  if (!room) {
    return;
  }
  io.to(roomName).emit("gameSetCocktails", clientDrinkInfo);
}

export async function gameSetCocktailIMG(
  roomName: string,
  strDrinkThumb: string
): Promise<void> {
  const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
  if (!room) {
    return;
  }
  io.to(roomName).emit("gameSetCocktailsIMG", strDrinkThumb);
}

function getRandomCocktail(): Cocktail {
  const randomIndex = Math.floor(Math.random() * cocktail.drinks.length);
  return cocktail.drinks[randomIndex];
}

function treeRandomDisCocktails(idDrink: string) {
  const cocktails: Cocktail[] = [];
  const usedIds: string[] = [idDrink];

  while (cocktails.length < 3) {
    const randomIndex = Math.floor(Math.random() * cocktail.drinks.length);
    const randomCocktail = cocktail.drinks[randomIndex];

    if (!usedIds.includes(randomCocktail.idDrink)) {
      cocktails.push(randomCocktail);
      usedIds.push(randomCocktail.idDrink);
    }
  }
  return cocktails.map((cocktail) => ({
    strDrink: cocktail.strDrink,
    idDrink: cocktail.idDrink,
  }));
}
