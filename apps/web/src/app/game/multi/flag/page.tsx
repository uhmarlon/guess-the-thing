"use client";
import { useRouter } from "next/navigation";
import { Viewhead } from "../../../../components/viewc";
import React, { useState } from "react";
import { uuid } from "@utils/util";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Page(): JSX.Element {
  const [activeTab, setActiveTab] = useState("leaderboard");
  const router = useRouter();
  const handleButtonClick = () => {
    const randomString = uuid();
    router.push(`/game/multi/flag/${randomString}`);
  };

  return (
    <Viewhead>
      <main className="text-white flex flex-col items-center justify-center mt-8 md:mt-6 mb-12 md:mb-2">
        <motion.div
          className="w-full md:w-3/4 md:bg-gttblack/60 md:shadow-gttblack/60 rounded-lg md:shadow-md p-2 md:p-6"
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Guess The Flag</h1>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="col-span-1 md:col-span-2 justify-center mb-4 hidden md:flex">
              <div className="w-64 h-64 relative">
                <Image
                  alt="Flag Game Image"
                  className="rounded-lg"
                  src="/gameimages/flagen.webp"
                  priority
                  fill
                />
              </div>
            </div>
            <div className="col-span-1 md:col-span-3 flex flex-col space-y-4">
              <button
                disabled
                className="bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                Single Player
              </button>
              <button
                onMouseDown={handleButtonClick}
                className="bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 transition-colors"
              >
                Play with Friends
              </button>
              <button
                disabled
                className="bg-gray-700 text-white py-3 px-6 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Game Instructions
              </button>
            </div>
          </div>

          <div className="mt-12  mb:mt-2 ">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <div className="flex flex-col md:flex-row">
                <button
                  className={`px-4 py-1 mb-2 md:mb-0 ${activeTab === "leaderboard" ? "bg-gttlightpurple text-white" : "bg-gttpurple text-white"} rounded-md md:rounded-none md:rounded-tl-md`}
                  onClick={() => setActiveTab("leaderboard")}
                >
                  Online Leaderboard
                </button>
                <button
                  className={`px-4 py-1 ${activeTab === "anotherTab" ? "bg-gttlightpurple text-white" : "bg-gttpurple text-white"} rounded-t-md md:rounded-none md:rounded-tr-md md:ml-2`}
                  onClick={() => setActiveTab("anotherTab")}
                >
                  Single Player Leaderboard
                </button>
              </div>
              <div className="text-sm font-bold mt-2 md:mt-0 blur-sm">
                20h 30min
              </div>
            </div>
            {activeTab === "leaderboard" && (
              <div className="h-64 overflow-y-scroll border-t-2 border-gray-700 custom-scrollbar blur-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="pb-2 border-b border-gray-600">#</th>
                      <th className="pb-2 border-b border-gray-600">Name</th>
                      <th className="pb-2 border-b border-gray-600">S/N/U</th>
                      <th className="pb-2 border-b border-gray-600">Zeit</th>
                      <th className="pb-2 border-b border-gray-600">
                        Punktzahl
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2">1.</td>
                      <td className="py-2">cebu</td>
                      <td className="py-2">90 / 3 / 215</td>
                      <td className="py-2">00h 28m</td>
                      <td className="py-2">4103</td>
                    </tr>
                    <tr>
                      <td className="py-2">2.</td>
                      <td className="py-2">Lunita</td>
                      <td className="py-2">107 / 2 / 235</td>
                      <td className="py-2">00h 47m</td>
                      <td className="py-2">3469</td>
                    </tr>
                    <tr>
                      <td className="py-2">3.</td>
                      <td className="py-2">Agata</td>
                      <td className="py-2">69 / 6 / 174</td>
                      <td className="py-2">00h 34m</td>
                      <td className="py-2">3396</td>
                    </tr>
                    <tr>
                      <td className="py-2">4.</td>
                      <td className="py-2">Love, learn h...</td>
                      <td className="py-2">53 / 3 / 115</td>
                      <td className="py-2">00h 25m</td>
                      <td className="py-2">3015</td>
                    </tr>
                    <tr>
                      <td className="py-2">5.</td>
                      <td className="py-2">Luuk</td>
                      <td className="py-2">54 / 2 / 115</td>
                      <td className="py-2">00h 23m</td>
                      <td className="py-2">2930</td>
                    </tr>
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
        </motion.div>
      </main>
    </Viewhead>
  );
}
