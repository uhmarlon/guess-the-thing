"use client";
import { useRouter } from "next/navigation";
import { Viewhead } from "../../../../components/viewc";
import React from "react";
import { uuid } from "@utils/util";
import { motion } from "framer-motion";
import Image from "next/image";
import Leaderboard from "src/components/ds/leaderboard";

export default function Page(): JSX.Element {
  const router = useRouter();
  const handleButtonClick = () => {
    const randomString = uuid();
    router.push(`/game/multi/flag/${randomString}`);
  };

  return (
    <Viewhead>
      <main className="text-white flex flex-col items-center justify-center mt-8 md:mt-6 mb-12 md:mb-2">
        <motion.div
          className="w-full md:w-3/4 md:bg-gttblack/60 md:shadow-gttblack/60 rounded-lg md:shadow-md p-2 md:p-6"
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Guess The Flag</h1>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="col-span-1 md:col-span-2 justify-center mb-4 hidden md:flex">
              <div className="w-64 h-64 relative">
                <Image
                  alt="Flag Game Image"
                  className="rounded-lg"
                  src="/gameimages/flagen.webp"
                  priority
                  fill
                />
              </div>
            </div>
            <div className="col-span-1 md:col-span-3 flex flex-col space-y-4">
              <button
                disabled
                className="bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                Single Player
              </button>
              <button
                onMouseDown={handleButtonClick}
                className="bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 transition-colors"
              >
                Play with Friends
              </button>
              <button
                disabled
                className="bg-gray-700 text-white py-3 px-6 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Game Instructions
              </button>
            </div>
          </div>
          <Leaderboard game="flag" />
        </motion.div>
      </main>
    </Viewhead>
  );
}
