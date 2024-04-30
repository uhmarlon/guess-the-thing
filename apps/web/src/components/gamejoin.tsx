"use client";
import React, { useRef, useState } from "react";
import { socket } from "../utils/game-socket";

export default function Gamejoincreate({
  gameType,
}: {
  gameType: string;
}): React.JSX.Element {
  const [showModal] = useState<boolean>(true);
  const gameIdRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (): void => {
    const gameToken = gameIdRef.current?.value ?? "";
    if (gameIdRef.current === null || gameToken.length === 0) {
      return;
    }
    socket.emit("joinGame", gameToken.trim(), gameType);
  };

  const handleNewGame = (): void => {
    socket.emit("newGame", gameType);
  };

  return (
    <>
      {showModal ? (
        <div
          aria-labelledby="modal-title"
          aria-modal="true"
          className="fixed inset-0 flex items-center justify-center z-50 overflow-x-hidden overflow-y-auto backdrop-blur-sm"
          role="dialog"
        >
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-gray-700 text-white rounded-lg shadow-lg w-full md:max-w-md">
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium" id="modal-title">
                  Join or Create a Game
                </h3>
                <div className="flex items-center justify-center mt-4">
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={handleNewGame}
                    type="submit"
                  >
                    New Game
                  </button>
                </div>
                <div className="mt-4">
                  <input
                    className="px-4 mr-3 py-2 text-white border rounded-lg bg-gray-800 border-gray-600  focus:border-blue-500 focus:outline-none focus:ring"
                    placeholder="Game ID"
                    ref={gameIdRef}
                    type="text"
                  />
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={handleSubmit}
                    type="submit"
                  >
                    Join Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
