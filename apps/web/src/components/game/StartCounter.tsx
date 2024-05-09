// StartCounter.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { socket } from "@utils/game-socket";

export default function StartCounter(): JSX.Element {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    socket.on("startCounter", () => {
      setCountdown(3); // Starting countdown at 3
    });

    return () => {
      socket.off("startCounter");
    };
  }, []);

  useEffect(() => {
    if (countdown !== null && countdown >= 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const containerVariants = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={containerVariants}
      >
        {countdown !== null ? (
          countdown >= 0 ? (
            <motion.div
              key={countdown}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-6xl font-bold text-center"
            >
              {countdown}
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-2xl font-bold text-center"
            >
              Game starts now!
            </motion.div>
          )
        ) : null}
      </motion.div>
    </div>
  );
}
