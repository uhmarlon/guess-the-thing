import React from "react";
import { io } from "socket.io-client";
import { socket } from "../pages/gusstheflag";
import { useRef, useState } from "react";

export default function Gamejoincreate({gameType}: {gameType: string}) {
    const [showModal, setShowModal] = useState<boolean>(true);
    const gameIdRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        const gameToken = gameIdRef.current?.value ?? "";
        if (gameIdRef.current == null || gameToken.length == 0) {
            return;
        }
        console.log(gameToken);
        socket.emit("joinGame", gameToken.trim(), gameType);
        socket.on("unknownCode", (gameCode) => {
            alert("Unknown game code: " + gameCode);
        });
        socket.on("tooManyPlayers", (gameCode) => {
            alert("Too many players in game: " + gameCode);
        });

    };

    const handleNewGame = () => {
        socket.emit("newGame", gameType);
    }

    return (
        <>
        {showModal && (
                <div
                className="fixed inset-0 flex items-center justify-center z-50 overflow-x-hidden overflow-y-auto backdrop-blur-sm"
                aria-modal="true"
                role="dialog"
                aria-labelledby="modal-title"
                >
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="bg-gray-700 text-white rounded-lg shadow-lg w-full md:max-w-md">
                            <div className="px-6 py-4">
                                <h3 id="modal-title" className="text-lg font-medium">
                                    Join or Create a Game
                                </h3>
                                <div className="flex items-center justify-center mt-4">
                                    <button
                                        type="submit"
                                        onClick={handleNewGame}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >New Game</button>
                                </div>
                                <div className="mt-4">
                                    <input
                                    type="text"
                                    placeholder="Game ID"
                                    ref={gameIdRef}
                                    className="px-4 mr-3 py-2 text-white border rounded-lg bg-gray-800 border-gray-600  focus:border-blue-500 focus:outline-none focus:ring"
                                    />
                                    <button
                                        type="submit"
                                        onClick={handleSubmit}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >Join Game</button>
                                </div>
                            </div>
                        </div>
                    </div>    
                </div>
            )}
        </>
    );
};
