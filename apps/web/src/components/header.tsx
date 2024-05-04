"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import React from "react";

function Header(): JSX.Element {
  const { data: session } = useSession();
  return (
    <header className="flex items-center justify-between bg-[#8A24FF] text-white p-1">
      <div className="flex items-center">
        <Link href="/">
          <Image
            alt="logo"
            className="h-8 w-8 sm:h-10 sm:w-10 ml-1 sm:ml-10"
            height={50}
            src="/icon/logo.png"
            width={50}
          />
        </Link>
        <Link href="/">
          <nav className="hidden sm:flex">
            <div className="font-bold">Guess The Thing</div>
          </nav>
        </Link>

        <nav className="hidden sm:flex gap-4 ml-6">
          <div className="hover:text-gray-400">HOME</div>
          <div className="hover:text-gray-400">ABOUT</div>
          {/* <Link className="hover:text-gray-400" href="/home">
            GAME 1
          </Link>
          <Link className="hover:text-gray-400" href="/about">
            Game 2
          </Link> */}
        </nav>
      </div>

      <div className="flex items-center gap-2 mr-1 sm:mr-10">
        <Link href="/join">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-center font-medium text-white backdrop-blur-sm">
            JOIN WITH CODE
          </span>
        </Link>
        {session?.user ? (
          <Link href="/my">
            <div className="hidden sm:flex">
              <React.Fragment>
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-center font-medium text-white backdrop-blur-sm whitespace-nowrap flex items-center">
                  <Image
                    alt="logo"
                    className="h-2 w-2 sm:h-8 sm:w-8 rounded-full mr-2"
                    height={50}
                    src={session.user.image ?? ""}
                    width={50}
                  />
                  {session.user.name?.toUpperCase()}
                </span>
              </React.Fragment>
            </div>
            <div className="sm:hidden">
              <Image
                alt="logo"
                className="h-9 w-9 rounded-full"
                height={50}
                src={session.user.image ?? ""}
                width={50}
              />
            </div>
          </Link>
        ) : (
          <span
            className="rounded-full border border-blue-500/90 bg-blue-500/40 px-4 py-2 text-center font-medium text-white backdrop-blur-sm"
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
