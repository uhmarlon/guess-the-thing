"use client";
import React from "react";
import QRCode from "qrcode.react";

interface QuizEntryProps {
  gameId: string | null;
  url: string | null;
}

const QuizEntry: React.FC<QuizEntryProps> = ({ gameId, url }) => {
  return (
    <div className="relative max-w-lg mx-auto">
      <div className="rounded overflow-hidden shadow-md bg-gttlightpurple">
        <QRCode
          value={`${url}/join/${gameId}`}
          size={200}
          bgColor="#00000000" // Transparent background
          fgColor="#FFFFFF" // White foreground
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
        <div className="p-2">
          {/* <p className="text-center text-gray-200 text-sm md:text-2xl">
            {url}/join/{gameId}
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default QuizEntry;
