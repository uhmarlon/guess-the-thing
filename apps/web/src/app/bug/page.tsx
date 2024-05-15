"use client";
import { useSession, signIn } from "next-auth/react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Viewhead } from "../../components/viewc";
import { getBackendURL } from "../../utils/game-api";

export default function BugTrackerPage(): JSX.Element {
  const { data: session } = useSession();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  if (!session) {
    return (
      <Viewhead>
        <main className="min-h-screen text-white flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">
              You have to be signed in to report a bug, that we can track it.
            </h1>
            <button
              className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
              onClick={() => signIn()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Sign In
            </button>
          </div>
        </main>
      </Viewhead>
    );
  }

  const handleBugSubmit = async (): Promise<void> => {
    const newBug = { title, description };

    try {
      const res = await fetch(getBackendURL() + "/bugreport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBug),
      });

      const resultMessage = res.ok
        ? "Bug reported successfully"
        : "Failed to report bug";
      setMessage(resultMessage);
    } catch (error) {
      console.error("Error while reporting bug:", error);
      setMessage("Failed to report bug due to a network error");
    }

    setTitle("");
    setDescription("");
  };

  return (
    <Viewhead>
      <main className="min-h-screen text-white p-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="rounded overflow-hidden shadow-lg bg-gradient-to-r from-purple-700 to-indigo-500 p-8 mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-center mb-4 flex items-center justify-center">
              Bug Tracker
            </h1>
            <p className="text-center mb-8">
              Submit and track bugs for our application. Please provide detailed
              information.
            </p>
            <div className="mb-4">
              <label htmlFor="title" className="block text-white mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-white mb-2">
                Description
              </label>
              <p className="text-sm text-gray-200 mb-2">
                Please provide as much detail as possible.
              </p>
              <textarea
                id="description"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <motion.button
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              onClick={handleBugSubmit}
            >
              Submit Bug
            </motion.button>
            {message && <p className="text-center mt-4">{message}</p>}
          </motion.div>
        </div>
      </main>
    </Viewhead>
  );
}
