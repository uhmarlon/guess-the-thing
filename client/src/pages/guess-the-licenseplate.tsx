import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import Gamejoincreate from "../components/Gamejoin";
import Lobby from "../components/Lobby";
import { useLobby, useGameToken } from "../utils/game";
import { socket } from "../core/gameSocket";

export interface Player {
  id: string;
  name: string;
  points: number;
  guess: boolean;
  correct: boolean;
}

export const guessTheLicensePlate: NextPage = () => {
  const { inLobby, setinLobby } = useLobby();
  const { gameToken, setgameToken } = useGameToken();

  const [timeLeft, setTimeLeft] = useState(0);
  const [abbreviation, setAbbreviation] = useState("");
  const [city, setCity] = useState("");
  const [gameRounds, setgameRounds] = useState(0);
  const [maxGameRounds, setmaxGameRounds] = useState(0);

  const [gameCreator, setGameCreator] = useState<boolean>(false);
  const [inGame, setInGame] = useState<boolean>(false);

  useEffect(() => {
    socket.on("gameCode", (gameCode) => {
      setinLobby(true);
      setGameCreator(true);
      setgameToken(gameCode);
      socket.emit("clientReady");
    });

    socket.on("gameStarted", () => {
      setInGame(true);
    });

    socket.on("gameRounds", (gameRounds, maxRounds) => {
      setgameRounds(gameRounds);
      setmaxGameRounds(maxRounds);
    });

    socket.on("gameCountdown", (timeLeft) => {
      setTimeLeft(timeLeft);
    });

    socket.on("gameSetAbbreviation", (abbreviation) => {
      setAbbreviation(abbreviation);
    });

    socket.on("gameSetCity", (city) => {
      setCity("_".repeat(city.length));
    });

    socket.on("update-players", (players: Player[]) => {
      console.log(players);
    });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (e.currentTarget.value === city) {
        // Increase points or declare victory
      }
      e.currentTarget.value = "";
    }
  };

  return (
    <>
      <Head>
        <title>Guess The License Plate</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!inLobby ? (
        <Gamejoincreate gameType="LicensePlate" />
      ) : (
        <Lobby gameToken={gameToken} startbutton={gameCreator} />
      )}

      <main className="mt-28">
        <h1 className="text-4xl text-center mb-2">Guess The License Plate</h1>
        <h2 className="text-1xl text-center mb-2">
          Runde: {gameRounds}/{maxGameRounds}
        </h2>
        <div className="flex justify-center mb-6">
          <h1 className="text-4xl">{abbreviation}</h1>
        </div>
        <div className="flex justify-center">
          <h1 className="text-4xl">{city}</h1>
        </div>
        <div className="flex justify-center mb-2">
          <h1 className="text-xl">{timeLeft} sek.</h1>
        </div>
        <div className="flex justify-center mb-4">
          <input
            type="text"
            name="Eingabe"
            placeholder="Stadt eingeben"
            onKeyDown={handleKeyDown}
            className="px-3 py-3 text-white border rounded-lg bg-gray-800 border-gray-600 w-72 focus:border-blue-500 focus:outline-none focus:ring"
          />
        </div>
      </main>
    </>
  );
};

export default guessTheLicensePlate;