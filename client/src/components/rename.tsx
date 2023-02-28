import React from "react";
import { io } from "socket.io-client";
import { socket } from "../pages/index";
import { useRef, useState } from "react";

export default function ReName({}) {
    const [showModal, setShowModal] = useState<boolean>(true);
    const [isValidName, setIsValidName] = useState<boolean>(false);
    const nameRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        setShowModal(false);
        const name = nameRef.current?.value ?? "";
        if (nameRef.current == null || name.length == 0) {
            return;
        }
        socket.emit("rename-player", name);
    };

    const checkInputLength = () => {
        const name = nameRef.current?.value.trim() ?? "";
        if (name.length >= 3 && name.length <= 10) {
            setIsValidName(true);
        } else {
            setIsValidName(false);
        }
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
                    <div className="bg-gray-700 text-white rounded-lg shadow-lg w-full md:max-w-md">
                        <div className="px-6 py-4">
                            <h3 id="modal-title" className="text-lg font-medium">
                                Was ist dein Name?
                            </h3>
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
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
