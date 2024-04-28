"use client";
import Link from "next/link";
import Image from "next/image";

function Header(): JSX.Element {
  return (
    <header className="flex items-center justify-between bg-[#515186] text-white p-1">
      <div className="flex items-center">
        <Link href="/">
          <Image
            alt="logo"
            className="h-8 w-8 sm:h-10 sm:w-10 ml-1 sm:ml-10"
            height={50}
            src="icon/logo.png"
            width={50}
          />
        </Link>
        <nav className="hidden sm:flex">
          <div className="font-bold">Guess The Thing</div>
        </nav>

        <nav className="hidden sm:flex gap-4 ml-6">
          <Link className="hover:text-gray-400" href="/home">
            GAME 1
          </Link>
          <Link className="hover:text-gray-400" href="/about">
            Game 2
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-2 mr-1 sm:mr-10">
        <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-center font-medium text-white backdrop-blur-sm">
          JOIN WITH CODE
        </span>
        <span className="mx-auto rounded-full border border-blue-500/90 bg-blue-500/40 px-4 py-2 text-center font-medium text-white backdrop-blur-sm">
          LOGIN
        </span>
      </div>
    </header>
  );
}

export default Header;
