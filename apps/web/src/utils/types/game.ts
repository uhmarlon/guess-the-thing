type Player = {
  id: string;
  name: string;
  points: number;
  level: number;
  loggedIn?: boolean;
  isHost?: boolean;
};

type gameLobbyClientInfo = {
  id: string;
  gamekey: string;
  hostIdplayer: string;
  playersinfo: Player[];
};

export enum GameState {
  LOBBY,
  START_COUNTER,
  GAME,
  END,
}

export type { Player, gameLobbyClientInfo };
