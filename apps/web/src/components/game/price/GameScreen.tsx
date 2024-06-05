"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { socket } from "@utils/game-socket";
import TimerComponent from "@components/ds/TimerComponent";
import UserInfo from "@components/ds/username";
import Image from "next/image";
import CocktailButtons from "src/components/game/drink/CocktailButtonGroup";

type scoreBoardData = {
  cocktailName: string;
  player: { username: []; score: []; level: [] };
};

type DrinkData = {
  DrinkThumb: string;
  options: {
    idDrink: string;
    strDrink: string;
  }[];
};

const ResultsPopup = ({
  cocktailImage,
  data,
}: {
  cocktailImage: string;
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
      <div className="p-4 mt-24 md:mt-28 h-fit rounded-lg bg-gray-800/70  text-white">
        <div className="flex justify-center">
          <div className="w-60 h-60">
            <Image
              src={cocktailImage}
              alt="Cocktail Image"
              width={400}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>
        <h2 className="flex pt-2 flex-row text-lg justify-center md:text-2xl font-bold">
          {data.cocktailName}
        </h2>
        <h2 className="text-lg md:pt-2 font-bold mb-2">Round Results</h2>
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

export default function PriceGameScreen(): JSX.Element {
  const [time, setTime] = useState(100);
  const [round, setRound] = useState(1);
  const [maxRounds, setMaxRounds] = useState(5);

  const [correctDrinkData, setCorrectDrinkData] = useState<DrinkData>();
  const [activeInput, setActiveInput] = useState(true);
  const [score, setScores] = useState(0);
  const [scoreBoard, setScoreBoard] = useState(false);
  const [scoreBoardData, setScoreBoardData] = useState<scoreBoardData>();
  const [playSound, setPlaySound] = useState(false);

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

    socket.on("DrinkData", (data) => {
      setActiveInput(true);
      setCorrectDrinkData(data);
    });

    socket.on("rightAnswer", (data) => {
      setScores(data.score);
    });

    socket.on("scoreBoard", (data) => {
      setScoreBoard(true);
      setScoreBoardData(data);
      setTime(5);
      setTimeout(() => {
        setPlaySound(false);
      }, 500);
    });

    return () => {
      socket.off("gameInfo");
      socket.off("answerHandel");
      socket.off("flagData");
      socket.off("rightAnswer");
      socket.off("scoreBoard");
    };
  }, []);

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
        <ResultsPopup
          cocktailImage={correctDrinkData?.DrinkThumb as string}
          data={scoreBoardData as scoreBoardData}
        />
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
          {!correctDrinkData && (
            <div className="text-white text-2xl md:text-4xl lg:text-6xl">
              Loading...
            </div>
          )}
          {correctDrinkData && (
            <div className="flex items-center justify-center pt-2">
              <div className="w-60 h-60 md:w-96 md:h-96 lg:w-96 lg:h-96">
                <Image
                  src={correctDrinkData.DrinkThumb}
                  alt="Drink Image"
                  width={400}
                  height={400}
                  className="rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center pt-2">
          <div className="w-80 h-15  text-center text-white md:w-96 lg:w-auto md:text-base lg:text-2xl overflow-hidden overflow-ellipsis">
            {!correctDrinkData?.options ? (
              "Loading..."
            ) : (
              <CocktailButtons
                active={activeInput}
                options={correctDrinkData?.options}
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
