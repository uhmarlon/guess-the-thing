"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { socket } from "@utils/game-socket";
import { CountryFlag } from "@components/game/flag/flag";
import TimerComponent from "@components/ds/TimerComponent";
import UserInfo from "@components/ds/username";

type scoreBoardData = {
  flagString: string;
  player: { username: []; score: []; level: [] };
};

const ResultsPopup = ({
  flag,
  data,
}: {
  flag: string;
  data: scoreBoardData;
}) => {
  const [scores, setScores] = useState<number[]>([]);
  const [sortedData, setSortedData] = useState<{
    username: string[];
    level: number[];
    score: number[];
  }>({ username: [], level: [], score: [] });

  useEffect(() => {
    setScores(data.player.score.map(() => 0));

    // Sort the data by score in descending order
    const combinedData = data.player.username.map((username, index) => ({
      username,
      level: data.player.level[index],
      score: data.player.score[index],
    }));

    combinedData.sort((a, b) => b.score - a.score);

    setSortedData({
      username: combinedData.map((item) => item.username),
      level: combinedData.map((item) => item.level),
      score: combinedData.map((item) => item.score),
    });

    const timers = combinedData.map((item, index) => {
      return setInterval(() => {
        setScores((prevScores) => {
          const newScores = [...prevScores];
          if (newScores[index] < item.score) {
            newScores[index] += 1;
          } else {
            clearInterval(timers[index]);
          }
          return newScores;
        });
      }, 10);
    });

    return () => {
      timers.forEach((timer) => clearInterval(timer));
    };
  }, [data.player.level, data.player.score, data.player.username]);

  return (
    <motion.div className="absolute top-0 left-0 w-full h-full backdrop-blur-lg flex justify-center z-0">
      <div className="p-4 mt-20 rounded-lg shadow-lg text-white">
        <div className="flex justify-center">
          <CountryFlag
            flagKey={flag}
            size={300}
            className="w-28 h-28 md:w-60 md:h-60"
          />
        </div>
        <h2 className="flex flex-row text-lg justify-center md:text-2xl font-bold">
          {data.flagString}
        </h2>
        <h2 className="text-lg font-bold mb-2">Round Results</h2>
        <table className="min-w-full">
          <tbody>
            {sortedData.username.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">
                  <UserInfo name={item} level={sortedData.level[index]} />
                </td>
                <motion.td
                  className="border px-4 py-2 w-32 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {scores[index]}
                </motion.td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default function FlagGameScreen(): JSX.Element {
  const router = useParams();
  const [time, setTime] = useState(100);
  const [round, setRound] = useState(1);
  const [maxRounds, setMaxRounds] = useState(5);
  const [flag, setFlag] = useState("US");
  const [countryString, setCountryString] = useState("***");
  const [activeInput, setActiveInput] = useState(true);
  const [score, setScores] = useState(0);
  const [scoreBoard, setScoreBoard] = useState(false);
  const [scoreBoardData, setScoreBoardData] = useState<scoreBoardData>();
  const [playSound, setPlaySound] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const containerVariants = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    socket.on("gameInfo", (data) => {
      setScoreBoard(false);
      setTime(data.maxTime);
      setRound(data.round);
      setMaxRounds(data.maxRounds);
      setPlaySound(true);
    });

    socket.on("flagData", (data) => {
      setFlag(data.flagKey);
      setCountryString(data.flagValue);
      setActiveInput(true);
      if (inputRef.current) {
        inputRef.current.value = ""; // clear the input
      }
    });

    socket.on("rightAnswer", (data) => {
      setActiveInput(false);
      setCountryString(data.flagValue);
      setScores(data.score);
    });

    socket.on("scoreBoard", (data) => {
      setScoreBoard(true);
      setScoreBoardData(data);
      setPlaySound(false);
      setTime(4);
    });

    return () => {
      socket.off("gameInfo");
      socket.off("answerHandel");
      socket.off("flagData");
      socket.off("rightAnswer");
      socket.off("scoreBoard");
    };
  }, []);

  useEffect(() => {
    if (activeInput && inputRef.current) {
      inputRef.current.value = ""; // clear the input
      inputRef.current.focus(); // set focus to the input
    }
  }, [activeInput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const data = {
        lobbyId: router.id,
        answer: e.currentTarget.value,
      };
      socket.emit("answerHandel", data);
      e.currentTarget.value = "";
    }
  };

  return (
    <div className="mt-3">
      <div className="fixed top-2 right-2 md:right-5 bg-purple-600 text-white font-bold text-xs md:text-sm lg:text-base p-2 shadow-lg rounded-lg">
        <div className="flex justify-between space-x-4">
          <div>ROUND</div>
          <div>
            {round}/{maxRounds}
          </div>
          <div>SCORE</div>
          <div>{score}</div>
        </div>
      </div>

      {scoreBoard && (
        <ResultsPopup flag={flag} data={scoreBoardData as scoreBoardData} />
      )}

      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={containerVariants}
      >
        <div className="flex items-center justify-center pb-2 md:pb-0">
          <div className="w-1/4 md:w-[6%]">
            <TimerComponent
              maxTime={time}
              round={round}
              playSound={playSound}
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <CountryFlag
            flagKey={flag}
            size={300}
            className="w-44 h-44 md:w-60 md:h-60"
          />
        </div>

        <div className="flex items-center justify-center pt-2">
          <div className="w-80 h-15  text-center text-white md:w-96 lg:w-auto md:text-base lg:text-2xl overflow-hidden overflow-ellipsis">
            {countryString}
          </div>
        </div>

        {activeInput && (
          <div className="flex justify-center mt-4">
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter Country Name"
              onKeyDown={handleKeyDown}
              className="px-3 py-3 text-white border rounded-lg bg-gray-800 border-gttlightpurple/50 border-spacing-2 w-72 focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
