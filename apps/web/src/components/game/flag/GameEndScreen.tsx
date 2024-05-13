"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useSession } from "next-auth/react";
import UserInfo from "src/components/ds/username";
import { Levelprogressbar } from "src/components/my/progressbar";

export default function FlagGameEnd(): JSX.Element {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const { data: session } = useSession();

  // Example users data, replace or update with actual game results data fetched from your server
  const users = [
    { name: "Alice", points: 98 },
    { name: "Test", points: 85 },
  ];
  const podium = [users[1], users[0], users[2]];

  // Sort users by points in descending order
  users.sort((a, b) => b.points - a.points);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // Animation variants for the podium places
  const podiumVariants = {
    initial: {
      scale: 0,
      opacity: 0,
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 0.8,
        delay: 0.3,
      },
    },
  };

  return (
    <div className="mt-3 ">
      <Confetti width={windowSize.width} height={windowSize.height} />
      <div className="justify-center items-center flex flex-col">
        {!session?.user && (
          <div className="bg-red-500 text-white p-2 rounded mt-2 max-w-sm">
            <p className="text-sm">
              You played as a guest. Next time, sign in to save your progress.
            </p>
          </div>
        )}
        <h1 className="text-4xl font-bold mt-2 sm:text-6xl">Game Over</h1>
        <p className="text-sm pb-2">Thanks for playing!</p>
        <p className="text-sm pb-2 text-gttred">
          This game is in beta. If you see a bug, please report it.
        </p>
        {/* Winner's podium */}
        {/* // user.lengt till 2 and not more */}
        {users.length <= 2 && (
          // two lines of users with the first as the winner in lines one by one dont use the podium
          <div className="relative">
            {users.map((user, index) => (
              <div
                key={index}
                className={`w-80 h-20 bg-gttlightpurple/30 rounded-md flex flex-col justify-center items-center p-2 m-2`}
              >
                <span className="text-lg font-bold ">{user.name}</span>
                <span className="text-sm">{user.points} pts</span>
                <span className="text-xl font-bold">
                  {index + 1}
                  {["st", "nd"][index]}
                </span>
              </div>
            ))}
          </div>
        )}
        {users.length > 2 && (
          <div className="space-x-2 flex justify-center items-end mb-4">
            {users.slice(0, 3).map((user, index) => (
              // sort the users by points and put the first play in the middel then the second as first and the third as last
              // then render the podium
              <motion.div
                key={index}
                className={`w-32 h-${[40, 48, 36][index]} bg-gttlightpurple/${["25", "40", "25"][index]} rounded-md flex flex-col justify-center items-center p-2`}
                variants={podiumVariants}
                initial="initial"
                animate="animate"
                custom={0.1 * index}
              >
                <span className="text-lg font-bold text-balance">
                  {podium[index].name}
                </span>
                <span className="text-sm">{podium[index].points} pts</span>
                <span className="text-xl font-bold">
                  {[2, 1, 3][index]}
                  {["nd", "st", "rd"][index]}
                </span>
              </motion.div>

              // <motion.div
              //   key={index}
              //   className={`w-${24 + index * 4} h-${32 + index * 8} bg-gray-${300 + index * 100} rounded-md flex flex-col justify-center items-center p-2`}
              //   variants={podiumVariants}
              //   initial="initial"
              //   animate="animate"
              //   custom={0.1 * index}
              // >
              //   <span className="text-lg font-bold">{user.name}</span>
              //   <span className="text-sm">{user.points} pts</span>
              //   <span className="text-xl font-bold">
              //     {index + 1}
              //     {["st", "nd", "rd"][index]}
              //   </span>
              // </motion.div>
            ))}
          </div>
        )}
        {/* Additional users table */}
        {users.length > 3 && (
          <div className="mt-2 relative">
            <table className="w-96 divide-y divide-gray-200 text-sm text-center">
              <tbody className=" divide-y divide-gray-200">
                {users.slice(3).map((user, index) => (
                  <tr key={index}>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <UserInfo name={user.name} level={user.points} />
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      {user.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {session?.user && (
          <div className="mt-4 text-center">
            {/* add xp to your level and current level */}
            <div className="text-lg font-bold">You earned 20 points!</div>
            <div className="text-sm">You are now level 2</div>
            <div className="w-96">
              <Levelprogressbar
                currentPoints={20}
                rangeStart={0}
                rangeEnd={100}
              />
            </div>
          </div>
        )}
        {/* // back home button */}
        <div className="mt-4">
          <button
            className="p-4 bg-blue-500 text-white rounded"
            onClick={() => window.location.replace("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
