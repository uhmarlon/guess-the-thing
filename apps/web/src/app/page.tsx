// pages/index.tsx

"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Viewheadonly } from "../components/viewc";
import { signIn, useSession } from "next-auth/react";

// Game Data
const games = [
  {
    title: "Guess The Flag",
    href: "/game/multi/flag",
    imgSrc: "/gameimages/flagen.webp",
    bgColor: "bg-red-600",
  },
  {
    title: "Guess The Drink",
    href: "/game/multi/drink",
    imgSrc: "/gameimages/drinks.webp", // Placeholder image
    bgColor: "bg-blue-600",
  },
  {
    title: "Coming Soon",
    description: "We are working on new games!",
    href: "#",
    imgSrc: "/commingsoon.webp", // Placeholder image
    bgColor: "bg-green-600",
  },
  {
    title: "Coming Soon",
    description: "We are working on new games!",
    href: "#",
    imgSrc: "/commingsoon.webp", // Placeholder image
    bgColor: "bg-green-600",
  },
];

export default function Page(): JSX.Element {
  const { data: session } = useSession();
  return (
    <Viewheadonly>
      <main className=" text-white flex flex-col items-center">
        <section className="w-full py-4 text-center">
          <h1 className="text-4xl font-bold text-yellow-400">
            Guess The Thing
          </h1>
          <p className="text-lg mt-2">
            Enjoy various guessing games. Challenge your friends or test your
            skills solo.
          </p>
          {!session && (
            <motion.button
              className="bg-yellow-500 text-black px-6 py-3 mt-4 rounded-full font-medium shadow-lg"
              whileHover={{ scale: 1.1 }}
              onClick={() => signIn()}
            >
              Register Now
            </motion.button>
          )}
        </section>

        <section className="w-full px-4 py-6 bg-gradient-to-b from-gray-800 to-gray-900 text-center">
          <motion.div
            className="bg-yellow-500 text-black py-2 px-4 rounded-full inline-block mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            We are currently in Beta. Join now to help us improve!
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={index}
                className={`relative w-full h-40 md:h-48 rounded-xl overflow-hidden`}
                whileHover={{ scale: 1.05 }}
              >
                <Link href={game.href}>
                  <Image
                    alt={game.title}
                    src={game.imgSrc}
                    height={200}
                    width={200}
                    className="object-cover rounded-xl mx-auto"
                  />
                  {/* <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-xl">
                    <p className="text-xl font-bold hidden">{game.title}</p>
                  </div> */}
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="w-full bg-gray-800 text-center py-12">
          <h2 className="text-4xl font-bold mb-8 text-yellow-400">
            Why Join Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            <div className="bg-gray-700 rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col items-center">
              <div className="text-5xl text-yellow-400 mb-4">🎮</div>
              <h3 className="text-2xl font-bold mb-2">Fun Games</h3>
              <p className="text-lg text-center">
                Enjoy a variety of entertaining games.
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col items-center">
              <div className="text-5xl text-yellow-400 mb-4">👥</div>
              <h3 className="text-2xl font-bold mb-2">Challenge Friends</h3>
              <p className="text-lg text-center">
                Compete with friends and see who wins.
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col items-center">
              <div className="text-5xl text-yellow-400 mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-2">New Games</h3>
              <p className="text-lg text-center">
                We are constantly adding new games for more fun.
              </p>
            </div>
          </div>
        </section>
      </main>
    </Viewheadonly>
  );
}
