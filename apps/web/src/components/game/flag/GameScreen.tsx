// StartCounter.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { socket } from "@utils/game-socket";
import { CountryFlag } from "@components/game/flag/flag";
import TimerComponent from "@components/ds/TimerComponent";
// TimerComponent.jsx

export default function FlagGameScreen(): JSX.Element {
  const containerVariants = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0, transition: { duration: 0.5 } },
  };

  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    setCountdown(12); // Starting countdown at 3
  }, []);

  useEffect(() => {
    if (countdown !== null && countdown >= 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="mt-3">
      <div className="fixed top-2 right-2 md:right-5 bg-purple-600 text-white font-bold text-xs md:text-sm lg:text-base p-2 shadow-lg rounded-lg">
        <div className="flex justify-between space-x-4">
          <div>ROUND</div>
          <div>1/5</div>
          <div>SCORE</div>
          <div>0</div>
        </div>
      </div>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={containerVariants}
      >
        <div className="flex items-center justify-center pb-2 md:pb-0">
          <div className="w-1/4 md:w-[6%]">
            <TimerComponent maxTime={20} />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <CountryFlag
            flagKey="US"
            size={300}
            className="w-44 h-44 md:w-60 md:h-60"
          />
        </div>

        <div className="flex items-center justify-center pt-2">
          <div className="w-80 h-15  text-center text-white md:w-96 lg:w-auto md:text-base lg:text-2xl overflow-hidden overflow-ellipsis">
            Demokratische Republik Kongo _ _ _ _ _ _
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <input
            type="text"
            placeholder="Land eingeben"
            //onKeyDown={handleKeyDown}
            className="px-3 py-3 text-white border rounded-lg bg-gray-800 border-gttlightpurple/50 border-spacing-2 w-72 focus:border-blue-500 focus:outline-none focus:ring"
          />
        </div>
      </motion.div>
    </div>
  );
}
