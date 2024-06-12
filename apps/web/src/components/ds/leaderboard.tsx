"use client";
import React, { useState, useEffect } from "react";
import { getBackendURL } from "@utils/game-api";
import { motion, useAnimation } from "framer-motion";
import UserInfo from "./username";

interface LeaderboardProps {
  game: string;
}

type LeaderboardData = {
  gametag: string;
  nextReset: string;
  statistics: {
    userName: string;
    levelpoints: number;
    score: number;
    timestamp: string;
    language: string;
  }[];
};

async function getData(game: string): Promise<LeaderboardData> {
  const res = await fetch(
    `${getBackendURL()}/game/statistices?gametag=${game}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data for leaderboard");
  }

  return res.json();
}

function getTimeRemaining(nextReset: string) {
  const now = new Date();
  const resetTime = new Date(nextReset);
  const timeDifference = resetTime.getTime() - now.getTime();

  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  return `${hours}h : ${minutes}m : ${seconds}s`;
}

export default function Leaderboard({ game }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<string>("leaderboard");
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const controls = useAnimation();

  useEffect(() => {
    async function fetchData() {
      try {
        const leaderboardData = await getData(game);
        setData(leaderboardData);
      } catch (err) {
        setError((err as Error).message);
      }
    }

    fetchData();
  }, [game]);

  useEffect(() => {
    if (data) {
      const interval = setInterval(() => {
        setTimeRemaining(getTimeRemaining(data.nextReset));
        controls.start({ opacity: 1 });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [data, controls]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-12 mb:mt-2">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex flex-col md:flex-row">
          <button
            className={`px-4 py-1 mb-2 md:mb-0 ${
              activeTab === "leaderboard"
                ? "bg-gttlightpurple text-white"
                : "bg-gttpurple text-white"
            } rounded-md md:rounded-none md:rounded-tl-md`}
            onClick={() => setActiveTab("leaderboard")}
          >
            Online Leaderboard
          </button>
          {/* <button
            className={`px-4 py-1 ${
              activeTab === "anotherTab"
                ? "bg-gttlightpurple text-white"
                : "bg-gttpurple text-white"
            } rounded-t-md md:rounded-none md:rounded-tr-md md:ml-2`}
            onClick={() => setActiveTab("anotherTab")}
          >
            Single Player Leaderboard
          </button> */}
        </div>
        <motion.div
          className="text-sm font-bold mt-2 md:mt-0"
          animate={controls}
        >
          {timeRemaining}
        </motion.div>
      </div>
      {activeTab === "leaderboard" && (
        <div className="h-64 overflow-y-scroll border-t-2 border-gray-700 custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="pb-2 border-b border-gray-600">#</th>
                <th className="pb-2 border-b border-gray-600">Player</th>
                <th className="pb-2 border-b text-right border-gray-600">
                  Language
                </th>
                <th className="pb-2 border-b pr-2 text-right border-gray-600">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data.statistics) &&
                data.statistics.map((entry, index) => (
                  <tr key={index}>
                    <td className="py-2">{index + 1}.</td>
                    <td className="py-2">
                      <UserInfo
                        name={entry.userName}
                        level={entry.levelpoints}
                      />
                    </td>
                    <td className="py-2 text-right">
                      {entry.language === "en" ? "English" : "German"}
                    </td>
                    <td className="py-2 pr-2 text-right">{entry.score}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === "anotherTab" && (
        <div className="h-64 overflow-y-scroll border-t-2 border-gray-700 custom-scrollbar blur-sm">
          {/* Content for another tab */}
        </div>
      )}
    </div>
  );
}
