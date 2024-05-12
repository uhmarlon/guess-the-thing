type Player = {
  id: string;
  name: string;
  points: number;
  level: number;
  loggedIn?: boolean;
  socketId: string;
  isHost?: boolean;
  isClassroom?: boolean;
};

type Lobby = {
  id: string;
  gamekey?: string;
  roundlobby?: number;
  hostIdplayer: string;
  players: Player[];
  gameMode: string;
  gameinside: Gameinside;
  gameState: "waiting" | "inGame" | "postGame";
};

type Gameinside = {
  gameId: string;
  maxTime?: number;
  round?: number;
  maxRounds?: number;
  scores?: {
    playerId: string;
    score: number;
    hasPlayed: boolean;
    isReady: boolean;
  }[];
  gameSpecial?: [unknown];
};

type GameResult = {
  gameId: string;
  scores: { playerId: string; score: number }[];
};

type GameData = {
  lobbies: Lobby[];
  resultold?: GameResult[];
};

export type { Gameinside, Player, Lobby, GameResult, GameData };
