"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import React from "react";

function Header(): JSX.Element {
  const { data: session, status } = useSession();

  return (
    <header className="flex items-center justify-between bg-[#8A24FF] text-white p-1 sm:p-2">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Link href="/">
          <Image
            alt="logo"
            className="h-8 w-8 sm:h-10 sm:w-10"
            height={50}
            src="/icon/logo.png"
            width={50}
          />
        </Link>
        <Link href="/">
          <nav className="whitespace-nowrap">
            <div className="font-bold text-xs sm:text-base">
              Guess The Thing
            </div>
          </nav>
        </Link>

        <nav className="hidden sm:flex gap-4 whitespace-nowrap">
          <Link href="/">
            <div className="hover:text-gray-400">HOME</div>
          </Link>
          <Link href="/bug">
            <div className="hover:text-gray-400">BUG REPORT</div>
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-2 ml-auto whitespace-nowrap">
        <Link href="/join">
          <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 sm:px-4 sm:py-2 text-center font-medium text-white backdrop-blur-sm text-xs sm:text-base">
            JOIN WITH CODE
          </span>
        </Link>
        {status === "loading" ? (
          <div className="flex items-center">
            <span className="ml-2 text-xs sm:text-base">Loading...</span>
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
            className="rounded-full border border-blue-500/90 bg-blue-500/40 px-2 py-1 sm:px-4 sm:py-2 text-center font-medium text-white backdrop-blur-sm cursor-pointer text-xs sm:text-base"
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
