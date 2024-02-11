import { Socket } from "socket.io";

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
  game: string;
  countryString: string;
  round: number;
  maxRounds: number;
}

export interface Room {
  sockets: Set<Socket>;
}

export interface Cocktail {
  strDrink: string;
  strDrinkThumb: string;
  strInstructions: string;
  idDrink: string;
}

export interface LicensePlate {
    "abbreviation": string,
    "city": string,
    "state": string
}

export interface LicensePlates {
    license_plates: [
        LicensePlate
    ]
}

export interface RoomMeta {
    roomName: string;
    game: string;
    countryString: string;
    round: number;
    maxRounds: number;
}