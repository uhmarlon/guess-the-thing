"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { socket } from "@utils/game-socket";
import TimerComponent from "@components/ds/TimerComponent";
import UserInfo from "@components/ds/username";
import Image from "next/image";
import { useParams } from "next/navigation";

type Player = {
  username: string;
  level: number;
  score: number;
  priceguess: string;
  differanz: string;
};

type scoreBoardData = {
  ItemPrice: number;
  player: Player[];
};

type PriceData = {
  Image: string;
  title: string;
};

export default function PriceGameScreen(): JSX.Element {
  const router = useParams();
  const [leaderboard, setLeaderboard] = useState<scoreBoardData>();
  const [time, setTime] = useState(100);
  const [round, setRound] = useState(1);
  const [maxRounds, setMaxRounds] = useState(5);

  const [priceInData, setPriceInData] = useState<PriceData>();
  const [activeInput, setActiveInput] = useState(true);
  const [score, setScores] = useState(0);
  const [price, setPrice] = useState("**.**");
  const [guessPrice, setGuessPrice] = useState("");
  const [playSound, setPlaySound] = useState(false);

  const containerVariants = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    socket.on("initalleaderboard", (data: scoreBoardData) => {
      setLeaderboard(data);
    });

    socket.on("gameInfo", (data) => {
      setTime(data.maxTime);
      setRound(data.round);
      setMaxRounds(data.maxRounds);
      setPlaySound(true);
    });

    socket.on("EbayData", (data) => {
      setActiveInput(true);
      setGuessPrice("");
      setPrice("**.**");
      setPriceInData(data);
    });

    socket.on("rightAnswer", (data) => {
      setScores(data.score);
    });

    socket.on("scoreBoard", (data) => {
      setActiveInput(false);
      setPrice(data.ItemPrice as string);
      setLeaderboard(data);

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

  const handelPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuessPrice(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (guessPrice === "") {
        return;
      }
      sendAnswer();
    }
  };

  const sendAnswer = () => {
    const data = {
      lobbyId: router.id,
      answer: guessPrice,
    };
    socket.emit("answerHandel", data);
  };

  return (
    <div className="mt-3">
      <div className="fixed top-2 right-2 md:right-5 bg-purple-600 text-white font-bold text-xs md:text-sm lg:text-base p-2 shadow-lg rounded-lg">
        <div className="flex justify-between space-x-4">
          <div>ROUND</div>
          <div>
            {round}/{maxRounds}
          </div>
          <div>POINTS</div>
          <div>{score}</div>
        </div>
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={containerVariants}
      >
        <div className="flex items-center justify-center pb-2 md:pb-2">
          <div className="w-1/4 md:w-[10%]">
            <TimerComponent
              maxTime={time}
              round={round}
              playSound={playSound}
            />
          </div>
        </div>

        <div className="bg-gttlightpurple/20 grid grid-cols-1 md:grid-cols-8 gap-4 p-4 max-w-6xl mx-auto rounded-none md:rounded-lg">
          <div className="md:col-span-5 md:col-start-4 flex flex-col items-center">
            <div className="relative w-64 h-64 md:w-96 md:h-96 m-2 bg-gttblack/95 flex items-center justify-center">
              {priceInData?.Image ? (
                <Image
                  src={priceInData?.Image}
                  alt="Price Image"
                  className="object-contain"
                  fill
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white rounded-lg">
                  <div className="text-center">Loading Image...</div>
                </div>
              )}
            </div>
            <div className="bg-gttblack/95 text-white w-full rounded-lg p-4">
              <div className="flex flex-col p-2 space-y-1 bg-opacity-10 bg-white rounded-lg">
                <div className="flex justify-between p-1 bg-opacity-10 hover:bg-gttgold/90 hover:text-black rounded-md">
                  <div className="pr-2 font-semibold">Title:</div>
                  <div className="text-right">
                    {priceInData?.title || "Loading Title..."}
                  </div>
                </div>
                <div className="flex justify-between p-1 bg-opacity-10 hover:bg-gttgold/90 hover:text-black rounded-md">
                  <div className="font-semibold">Price:</div>
                  <div>{price} $</div>
                </div>
              </div>
              <div className="flex p-2 space-x-2 bg-opacity-10 bg-white rounded-lg mt-4">
                <input
                  className="w-full p-2 text-black rounded-lg focus:border-gttlightpurple ring-gttlightpurple"
                  type="number"
                  placeholder="Enter your guess ..."
                  step="0.01"
                  min="0.01"
                  max="100000000"
                  disabled={!activeInput}
                  onChange={handelPrice}
                  onKeyDown={handleKeyDown}
                  value={guessPrice}
                />
                <button
                  onClick={sendAnswer}
                  className="bg-gttlightpurple/80 text-white p-2 rounded-lg"
                >
                  GUESS
                </button>
              </div>
            </div>
          </div>
          <div className="md:col-span-3 md:col-start-1 md:row-start-1 self-start bg-opacity-10 bg-white rounded-lg p-4 overflow-auto max-h-64 md:max-h-[25rem] custom-scrollbar">
            <p className="p-1 font-semibold text-center">Leaderboard</p>
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="p-1 text-left">#</th>
                  <th className="p-1 text-left">Name</th>
                  <th className="p-1 text-right">Price</th>
                  <th className="p-1 text-right">+/−</th>
                  <th className="p-1 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard?.player.map((player, index) => (
                  <tr key={index}>
                    <td className="p-1 text-left">{index + 1}</td>
                    <td className="p-1 text-left">
                      <UserInfo name={player.username} level={player.level} />
                    </td>
                    <td className="p-1 text-right">{player.priceguess} $</td>
                    <td className="p-1 text-right">{player.differanz} $</td>
                    <td className="p-1 text-right">{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
