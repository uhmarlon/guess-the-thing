import React from "react";
import { io } from "socket.io-client";
import { socket } from "../pages/index";
import { useRef, useState } from "react";

export default function ProjectPost({}) {

    const handleSubmit = () => {
        const nameRef = useRef<HTMLInputElement>(null);
        if (nameRef.current && nameRef.current.value) {
          socket.emit("rename-player", nameRef.current.value);
        }
    };

    const [showModal, setShowModal] = useState(true);



    return (
        <>
            {showModal && (
            <div tabIndex={-1} aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
                <div className="relative w-full h-full max-w-md md:h-auto">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="px-6 py-6 lg:px-8">
                            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                                Was ist dein Name?
                            </h3>
                            <div className="flex flex-col mb-4 space-y-2">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Name"
                                    className="px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring"
                                />
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    );
};