import React, { useRef, useState, useEffect } from "react";
import Confetti from "react-confetti";
//import type { Player } from "../../../../old/client/src/pages/gusstheflag";
import { socket } from "../utils/game-socket";

export default function Lobby({
  gameToken,
  startbutton,
}: {
  gameToken: string;
  startbutton: boolean;
}): React.JSX.Element {
  const [showModal, setShowModal] = useState<boolean>(true);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [gameWinner, setGameWinner] = useState<Player[]>([]);
  const [showRename, setShowRename] = useState<boolean>(false);
  const [isValidName, setIsValidName] = useState<boolean>(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const [gameRound, setGameRound] = useState<number>(10);

  const handleSubmit = (): void => {
    const name = nameRef.current?.value ?? "";
    if (nameRef.current === null || name.length === 0) {
      return;
    }
    socket.emit("rename-player", name);
  };

  const handleNewGame = (): void => {
    socket.emit("cgameStart", gameRound);
  };

  const checkInputLength = (): void => {
    const name = nameRef.current?.value.trim() ?? "";
    if (name.length >= 3 && name.length <= 21) {
      setIsValidName(true);
    } else {
      setIsValidName(false);
    }
  };

  useEffect(() => {
    socket.on("update-players", (players: Player[]) => {
      const playerList = document.getElementById("playerlist");
      if (playerList === null) {
        return;
      }
      playerList.innerHTML = "";
      players.forEach((player) => {
        const li = document.createElement("li");
        li.textContent = player.name;
        playerList.appendChild(li);
      });
    });

    socket.on("gameStarted", () => {
      setShowModal(false);
    });

    socket.on("gameEnd", (gameEnd) => {
      setShowConfetti(true);
      setGameWinner(gameEnd as Player[]);
    });
  }, []);

  return (
    <>
      {showConfetti ? (
        <div>
          <div className="fixed inset-0 flex items-center justify-center z-50 overflow-x-hidden overflow-y-auto backdrop-blur-sm">
            <Confetti height={window.innerHeight} width={window.innerWidth} />
            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-gray-700 text-white rounded-lg shadow-lg w-full md:max-w-md z-50 p-12">
                <div className=" font-bold">Gewinner </div>
                <div className="mt-2">
                  {gameWinner.map((player) => (
                    <div key={player.id}>{player.name}</div>
                  ))}
                </div>
                <button
                  className="text-white font-semibold mt-2 h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto bg-sky-500 highlight-white/20 hover:bg-sky-400"
                  onClick={() => (window.location.href = "/")}
                  type="button" // Add this line
                >
                  Zurück zum Hauptmenü
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {showModal ? (
        <div
          aria-labelledby="modal-title"
          aria-modal="true"
          className="fixed inset-0 flex items-center justify-center z-50 overflow-x-hidden overflow-y-auto backdrop-blur-sm"
          role="dialog"
        >
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-gray-700 text-white rounded-lg shadow-lg w-full md:max-w-md">
              <div className="px-6 py-4 text-center">
                <h3 className="text-lg font-medium" id="modal-title">
                  Game Token: <br />
                  {gameToken}
                </h3>
                {startbutton ? (
                  <>
                    <hr className="my-4" />

                    <h3 className="text-lg font-medium">
                      Choose the number of rounds
                    </h3>
                    <div className="flex items-center justify-center mt-4">
                      <button
                        className={`px-4 mx-2 py-2 text-sm font-medium text-white ${
                          gameRound === 10 ? "bg-blue-500" : "bg-green-500"
                        } border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        onClick={() => {
                          setGameRound(10);
                        }}
                        type="submit"
                      >
                        10
                      </button>
                      <button
                        className={`px-4 mx-2 py-2 text-sm font-medium text-white ${
                          gameRound === 15 ? "bg-blue-500" : "bg-green-500"
                        } border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        onClick={() => {
                          setGameRound(15);
                        }}
                        type="submit"
                      >
                        15
                      </button>
                      <button
                        className={`px-4 mx-2 py-2 text-sm font-medium text-white  ${
                          gameRound === 30 ? "bg-blue-500" : "bg-green-500"
                        } border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        onClick={() => {
                          setGameRound(30);
                        }}
                        type="submit"
                      >
                        30
                      </button>
                    </div>

                    <div className="flex items-center justify-center mt-4">
                      <button
                        className="px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={handleNewGame}
                        type="submit"
                      >
                        Start Game
                      </button>
                    </div>
                  </>
                ) : null}
                <hr className="my-4" />
                {showRename ? (
                  <div className="mt-4">
                    <input
                      className="px-4 mr-3 py-2 text-white border rounded-lg bg-gray-800 border-gray-600  focus:border-blue-500 focus:outline-none focus:ring"
                      id="name"
                      name="name"
                      onChange={checkInputLength}
                      placeholder="Name"
                      ref={nameRef}
                      type="text"
                    />
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={!isValidName}
                      onClick={handleSubmit}
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => {
                        setShowRename(true);
                      }}
                      type="submit"
                    >
                      Rename
                    </button>
                  </div>
                )}

                <div className="bg-gray-600 text-center rounded-lg w-72 mt-2">
                  <ul className=" text-white" id="playerlist" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
