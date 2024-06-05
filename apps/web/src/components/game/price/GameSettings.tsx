"use client";
import React from "react";
import { useState, useEffect } from "react";
import { socket } from "../../../utils/game-socket";

type Props = {
  isHost: boolean;
  lobbyid?: string;
};

const GameSettings: React.FC<Props> = ({ isHost, lobbyid }) => {
  const [round, setRound] = useState(5);
  const [roundTime, setRoundTime] = useState(15);
  const [roundTimeCheck, setRoundTimeCheck] = useState("10");
  const [gameStart, setGameStart] = useState(false);
  const [fewPlayers, setFewPlayers] = useState(false);

  useEffect(() => {
    //TODO FIX ERROR WITH IMPUT VALUE that is be null
    if (!roundTimeCheck || isNaN(parseInt(roundTimeCheck))) {
      return;
    }

    const roundtime = parseInt(roundTimeCheck);

    if (roundtime > 60) {
      setRoundTime(60);
      socket.emit("setRoundTime", lobbyid, 60);
    } else if (roundtime < 1) {
      setRoundTime(1);
      socket.emit("setRoundTime", lobbyid, 1);
    } else {
      setRoundTime(roundtime);
      socket.emit("setRoundTime", lobbyid, roundtime);
    }
  }, [roundTimeCheck, lobbyid]);

  useEffect(() => {
    socket.emit("setRound", lobbyid, round);
  }, [round, lobbyid]);

  useEffect(() => {
    if (gameStart) {
      socket.emit("startGame", lobbyid);
    }
  }, [gameStart, lobbyid]);

  useEffect(() => {
    socket.on("gameStartError", () => {
      setGameStart(false);
      setFewPlayers(true);
    });
    return () => {
      socket.off("gameStartError");
    };
  }, []);

  if (isHost === false) {
    return null;
  }

  if (!lobbyid) {
    return null;
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold">Game Settings - Host Only</h2>
      <div>
        <span className="text-gray-200 text-sm">Number of rounds</span>
        <select
          className="block w-full bg-gray-800 text-white border border-gray-700 rounded-md py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-900 focus:border-gray-900 max-w-md"
          id="grid-state"
          onChange={(e) => setRound(parseInt(e.target.value))}
        >
          <option value={5}>5 rounds</option>
          <option value={10}>10 rounds</option>
          <option value={15}>15 rounds</option>
        </select>
        <span className="text-gray-200 text-sm">Max Round Time (seconds)</span>
        <input
          type="number"
          className="block w-full bg-gray-800 text-white border border-gray-700 rounded-md py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-900 focus:border-gray-900 max-w-md"
          onChange={(e) => {
            setRoundTimeCheck(e.target.value);
          }}
          min={1}
          max={60}
          value={roundTime}
          placeholder="Max Round Time (seconds)"
        />
      </div>
      {fewPlayers && (
        <p className="text-gttred">
          You need at least 2 players to start the game
        </p>
      )}
      <div className="mt-4">
        {(gameStart && (
          <p className="text-gttgreen">Game is starting...</p>
        )) || (
          <button
            className="bg-gttgreen font-bold text-white py-2 px-4 rounded"
            onClick={() => {
              setGameStart(true);
            }}
          >
            Start Game
          </button>
        )}
      </div>
    </div>
  );
};

export default GameSettings;
