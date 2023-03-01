import React from "react";
import { io } from "socket.io-client";
import { socket, Player } from "../pages/index";
import { useRef, useState, useEffect } from "react";

export default function Lobby({ gameToken, startbutton}: { gameToken: string; startbutton: boolean; }) {
    const [showModal, setShowModal] = useState<boolean>(true);
    const [showRename, setShowRename] = useState<boolean>(false);
    const gameIdRef = useRef<HTMLInputElement>(null);
    const [isValidName, setIsValidName] = useState<boolean>(false);
    const nameRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        const name = nameRef.current?.value ?? "";
        if (nameRef.current == null || name.length == 0) {
            return;
        }
        socket.emit("rename-player", name);
    };

    const handleNewGame = () => {
        socket.emit("cgameStart");
    }

    const checkInputLength = () => {
        const name = nameRef.current?.value.trim() ?? "";
        if (name.length >= 3 && name.length <= 21) {
            setIsValidName(true);
        } else {
            setIsValidName(false);
        }
    }

    useEffect(() => {
        socket.on('update-players', (players: Player[]) => {
          console.log(players);
          const playerList = document.getElementById('playerlist') as HTMLElement;
          if (playerList) {
            playerList.innerHTML = '';
            players.forEach((player) => {
              const li = document.createElement('li');
              li.textContent = player.name;
              playerList.appendChild(li);
            });
          }
        });

        socket.on('gameStarted', () => {
            setShowModal(false);
        })

        socket.on('gameEnd', (gameEnd) => {
            alert('\t Gewinner: \n' + gameEnd[0].name + " | Mit " + gameEnd[0].points + " Punkten");
            window.location.reload();
        })

    }, [])

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
                            <div className="px-6 py-4 text-center">
                                <h3 id="modal-title" className="text-lg font-medium">
                                    Game Token: <br />{gameToken}
                                </h3>
                                {/* center button */}
                                {startbutton ? (
                                <div className="flex items-center justify-center mt-4">
                                    <button
                                        type="submit"
                                        onClick={handleNewGame}
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >Start Game</button>
                                </div>
                                ) : (<></>)}
                                { showRename ? (
                                    <div className="mt-4">
                                    <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Name"
                                    ref={nameRef}
                                    onChange={checkInputLength}
                                    className="px-4 mr-3 py-2 text-white border rounded-lg bg-gray-800 border-gray-600  focus:border-blue-500 focus:outline-none focus:ring"
                                    />
                                    <button
                                        type="submit"
                                        onClick={handleSubmit}
                                        disabled={!isValidName}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >Submit</button>
                                </div>
                                ) : (
                                    <div className="mt-4">
                                        <button
                                            type="submit"
                                            onClick={() => setShowRename(true)}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >Rename</button>
                                    </div>
                                )}
                                
                                <div className='bg-gray-600 text-center rounded-lg w-72 mt-2'>
                                    <ul id='playerlist' className=' text-white'></ul>
                                </div>
                            </div>
                        </div>
                    </div>    
                </div>
            )}
        </>
    );
};
