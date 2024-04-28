import { useState } from 'react';

let inLobbyInitialState = false;
let gameTokenInitialState = 'xxxx';

export const useLobby = (): { inLobby: boolean, setinLobby: Function } => {
  const [inLobby, setinLobby] = useState<boolean>(inLobbyInitialState);

  return { inLobby, setinLobby };
};

export const useGameToken = (): { gameToken: string, setgameToken: Function } => {
  const [gameToken, setgameToken] = useState<string>(gameTokenInitialState);

  return { gameToken, setgameToken };
};
