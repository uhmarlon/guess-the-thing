"use client";
import React, { useState } from "react";
import QRCode from "qrcode.react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface QuizEntryProps {
  gameId: string | null;
  url: string | null;
}

const QuizEntry: React.FC<QuizEntryProps> = ({ gameId, url }) => {
  const [copied, setCopied] = useState(false);
  const fullUrl = `${url}/join?c=${gameId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        "https://guessthething.io/join?c=" + gameId
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log("Failed to copy: ", err);
    }
  };

  return (
    <div className="relative max-w-lg mx-auto">
      <div className="rounded overflow-hidden shadow-md bg-gttlightpurple">
        <QRCode
          value={"https://guessthething.io/join?c=" + gameId}
          size={200}
          bgColor="#00000000"
          fgColor="#FFFFFF"
          className="mx-auto mt-4 hidden sm:block"
        />
        <div className="sm:hidden">
          <p className="text-center pt-2">Game code:</p>
        </div>
        <h1 className="text-3xl pt-6 pb-2 font-bold text-center text-gttgold hidden sm:block">
          JOIN THE QUIZ
        </h1>
        <div className="border-t border-gttgold mx-4 hidden sm:block"></div>
        <h2 className="text-4xl pt-2 font-extrabold text-center text-gttgold">
          {gameId ? gameId : "Generating Game ID..."}
        </h2>
        <div className="p-2 flex flex-row items-center">
          <p className="text-center text-gray-200 text-sm md:text-lg flex-grow">
            {fullUrl}
          </p>
          <motion.div
            whileTap={{ scale: 0.9 }}
            onClick={copyToClipboard}
            className="cursor-pointer mx-auto"
          >
            <Image
              src="/icon/copy.svg"
              alt="Copy to clipboard"
              width={20}
              height={20}
            />
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gttpurple text-white py-2 px-6 rounded-lg shadow-lg flex items-center"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizEntry;
