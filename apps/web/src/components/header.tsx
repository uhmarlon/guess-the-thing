"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

import { useSession, signIn } from "next-auth/react";
import React from "react";
import { usePathname } from "next/navigation";

function Header(): JSX.Element {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between bg-[#8A24FF] text-white p-2 sm:p-2">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Link href="/" className="hidden sm:flex">
          <Image
            alt="logo"
            className="h-8 w-8 sm:h-10 sm:w-10"
            height={50}
            src="/icon/logo.png"
            width={50}
          />

          <nav className="whitespace-nowrap content-center">
            <p className="font-bold text-xs sm:text-base">Guess The Thing</p>
          </nav>
        </Link>

        <div className="flex sm:hidden">
          {pathname === "/" ? (
            <Image
              alt="logo"
              className="h-8 w-8"
              height={50}
              src="/icon/logo.png"
              width={50}
            />
          ) : (
            <MobileBurgerMenu />
          )}
        </div>

        <nav className="hidden sm:flex gap-4 whitespace-nowrap">
          <Link href="/">
            <div className="hover:text-gray-400">HOME</div>
          </Link>
          <Link href="/bug">
            <div className="hover:text-gray-400">BUG REPORT</div>
          </Link>
        </nav>
      </div>

      <div className="flex gap-2 ml-auto md:items-center whitespace-nowrap">
        <Link href="/join" className="content-center">
          <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1.5 sm:px-4 sm:py-2 text-center font-medium text-white backdrop-blur-sm text-base sm:text-base">
            JOIN WITH CODE
          </span>
        </Link>
        {status === "loading" ? (
          <div className="flex items-center">
            <span className="ml-2 p-1.5 text-base">Loading...</span>
          </div>
        ) : session?.user ? (
          <Link href="/my">
            <div className="flex items-center">
              <span className="hidden sm:flex rounded-full border border-white/20 bg-white/10 px-2 py-1 sm:px-4 sm:py-1 text-center font-medium text-white backdrop-blur-sm items-center text-xs sm:text-base">
                <Image
                  alt="profile picture"
                  className="h-6 w-6 sm:h-8 sm:w-8 rounded-full mr-2"
                  height={50}
                  src={session.user.image ?? ""}
                  width={50}
                />
                <span className="truncate max-w-[100px]">
                  {session.user.name?.toUpperCase()}
                </span>
              </span>
              <Image
                alt="profile picture"
                className="h-9 w-9 rounded-full sm:hidden"
                height={50}
                src={session.user.image ?? ""}
                width={50}
              />
            </div>
          </Link>
        ) : (
          <span
            className="rounded-full border border-blue-500/90 bg-blue-500/40 px-2 py-1 sm:px-4 sm:py-2 text-center font-medium text-white backdrop-blur-sm cursor-pointer text-base sm:text-base"
            onClick={(): unknown => signIn()}
          >
            LOGIN
          </span>
        )}
      </div>
    </header>
  );
}

export default Header;

const MobileBurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const variants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  return (
    <div className="relative">
      <Image
        src="/icon/hamburger.svg"
        alt="Burger Menu"
        width={50}
        height={50}
        className="cursor-pointer h-5 w-5"
        onClick={() => setIsOpen(!isOpen)}
      />
      <motion.div
        className="fixed top-0 left-0 h-full w-64 bg-gttblack/95 text-white z-10"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={variants}
        transition={{ type: "spring", stiffness: 260, damping: 80 }}
      >
        <button
          className="absolute top-0 right-0 mt-4 mr-4"
          onClick={() => setIsOpen(false)}
        >
          <Image
            src="/icon/cross.svg" // Stellen Sie sicher, dass Sie ein Schließ-Icon haben
            alt="Schließen"
            width={25}
            height={25}
          />
        </button>
        <div className="p-5">
          <h2 className="text-xl font-bold">Guess The Thing</h2>
          <ul className="mt-4">
            <Link href="/">
              <li className="py-2">Home</li>
            </Link>
            {/* <li className="py-2">Über uns</li>
            <li className="py-2">Dienstleistungen</li>
            <li className="py-2">Kontakt</li> */}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};
