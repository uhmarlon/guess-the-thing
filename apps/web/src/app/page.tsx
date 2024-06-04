// pages/index.tsx

"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Viewhead } from "../components/viewc";
import { signIn, useSession } from "next-auth/react";

// Spiele-Daten
const games = [
  {
    title: "Guees The Flag",
    href: "/game/multi/flag",
    imgSrc: "/gameimages/flagen.webp",
    bgColor: "bg-red-500",
  },
  {
    title: "Guess The Drink",
    href: "/game/multi/drink",
    imgSrc: "/gameimages/drinks.webp", // Placeholder image
    bgColor: "bg-blue-500",
  },
  {
    title: "Coming Soon",
    description: "We are working on new games!",
    href: "#",
    imgSrc: "/commingsoon.webp", // Placeholder image
    bgColor: "bg-blue-500",
  },
  {
    title: "Coming Soon",
    description: "We are working on new games!",
    href: "#",
    imgSrc: "/commingsoon.webp", // Placeholder image
    bgColor: "bg-blue-500",
  },
  {
    title: "Coming Soon",
    description: "We are working on new games!",
    href: "#",
    imgSrc: "/commingsoon.webp", // Placeholder image
    bgColor: "bg-blue-500",
  },
];

export default function Page(): JSX.Element {
  const { data: session } = useSession();
  return (
    <Viewhead>
      <main className="mt-6 md:mt-12 bg-gray-900 text-white">
        <div className="z-20 flex w-full flex-col items-center">
          <div className="w-full bg-yellow-500 text-black py-3 text-center">
            <motion.p
              className="text-lg font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              We are currently in Beta. Join now to help us improve!
            </motion.p>
          </div>
          <div className="w-full bg-gradient-to-r  from-purple-700 to-indigo-500 py-12 text-center">
            <motion.h1
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Guess The Thing
            </motion.h1>
            <motion.p
              className="text-xl mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              Join our platform to enjoy various guessing games. Challenge your
              friends or test your skills solo across multiple fun and engaging
              game modes!
            </motion.p>
            {!session && (
              <div className="flex justify-center space-x-4">
                <motion.button
                  className="bg-yellow-500 text-black px-6 py-3 rounded-full font-medium"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => signIn()}
                >
                  Register Now
                </motion.button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6 w-full max-w-screen-lg">
            {games.map((game, index) => (
              <motion.div
                key={index}
                className={`relative w-full h-48 ${game.bgColor} rounded-xl overflow-hidden`}
                whileHover={{ scale: 1.05 }}
              >
                <Link href={game.href}>
                  <Image
                    alt={game.title}
                    src={game.imgSrc}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4"></div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </Viewhead>
  );
}
