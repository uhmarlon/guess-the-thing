// pages/game/multi/flag/index.tsx

"use client";
import { useRouter } from "next/navigation";
import { Viewhead } from "../../../../components/viewc";
import React from "react";
import { uuid } from "@utils/util";
import { motion } from "framer-motion";

export default function Page(): JSX.Element {
  const router = useRouter();
  const handleButtonClick = () => {
    const randomString = uuid();
    router.push(`/game/multi/price/${randomString}`);
  };

  return (
    <Viewhead>
      <main className="min-h-screen text-white flex flex-col items-center justify-center">
        <motion.div
          className="relative mt-16 mb-32 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="rounded overflow-hidden shadow-lg bg-gradient-to-r from-purple-700 to-indigo-500 p-8">
            <h1 className="text-3xl font-bold text-center mb-4">
              Start the Guess The Price Game
            </h1>
            <p className="text-center mb-8">
              Ready to test your knowledge of prices? Click the button below to
              create a lobby and start playing!
            </p>
            <motion.button
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              onClick={handleButtonClick}
            >
              Create Lobby
            </motion.button>
          </div>
        </motion.div>
      </main>
    </Viewhead>
  );
}
