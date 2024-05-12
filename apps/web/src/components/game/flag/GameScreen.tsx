"use client";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    setScores(data.player.score.map(() => 0));

    const timers = data.player.score.map((score, index) => {
      return setInterval(() => {
        setScores((prevScores) => {
          const newScores = [...prevScores];
          if (newScores[index] < score) {
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
  }, [data.player.score]);

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
            {data.player.username.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">
                  <UserInfo name={item} level={data.player.level[index]} />
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
  const [scoreBoard, setScoreBoard] = useState(false);
  const [scoreBoardData, setScoreBoardData] = useState<scoreBoardData>();

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
    });

    socket.on("flagData", (data) => {
      setActiveInput(true);
      setFlag(data.flagKey);
      setCountryString(data.flagValue);
    });

    socket.on("rightAnswer", (data) => {
      setActiveInput(false);
      setCountryString(data);
    });

    socket.on("scoreBoard", (data) => {
      setScoreBoard(true);
      setScoreBoardData(data);
      setTime(4);
    });

    return () => {
      socket.off("gameInfo");
      socket.off("answerHandel");
      socket.off("flagData");
    };
  }, []);

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
          <div>0</div>
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
            <TimerComponent maxTime={time} round={round} />
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
              type="text"
              placeholder="Land eingeben"
              onKeyDown={handleKeyDown}
              className="px-3 py-3 text-white border rounded-lg bg-gray-800 border-gttlightpurple/50 border-spacing-2 w-72 focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}

// TODO: REMOVE IF NOT NEEDED
// function Tickicon() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="30"
//       height="30"
//       fill="none"
//       viewBox="0 0 24 24"
//     >
//       <path
//         stroke="#65CF58"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M15.142 9.983l-4.267 4.267-1.455-1.454M12 3a9 9 0 100 18 9 9 0 000-18z"
//       ></path>
//     </svg>
//   );
// }

// function Crossicon() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="30"
//       height="30"
//       fill="none"
//       viewBox="0 0 24 24"
//     >
//       <path
//         fill="#CC2936"
//         d="M15.89 9.525a1 1 0 00-1.415-1.414l1.414 1.414zm-7.78 4.95a1 1 0 101.415 1.414l-1.414-1.414zm6.365 1.414a1 1 0 001.414-1.414l-1.414 1.414zm-4.95-7.778a1 1 0 00-1.414 1.414l1.414-1.414zM20 12a8 8 0 01-8 8v2c5.523 0 10-4.477 10-10h-2zm-8 8a8 8 0 01-8-8H2c0 5.523 4.477 10 10 10v-2zm-8-8a8 8 0 018-8V2C6.477 2 2 6.477 2 12h2zm8-8a8 8 0 018 8h2c0-5.523-4.477-10-10-10v2zm2.475 4.11l-3.182 3.183 1.414 1.414 3.182-3.182-1.414-1.414zm-3.182 3.183L8.11 14.475l1.414 1.414 3.182-3.182-1.414-1.414zm4.596 3.182l-3.182-3.182-1.414 1.414 3.182 3.182 1.414-1.414zm-3.182-3.182L9.525 8.11 8.111 9.525l3.182 3.182 1.414-1.414z"
//       ></path>
//     </svg>
//   );
// }
