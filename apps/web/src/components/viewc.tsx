"use client";

import Header from "../components/header";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Viewc({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div>
      <div className="text-white  bg-gradient-to-bl from-gttpurple to-gttblack min-h-screen">
        <header className="p-1">
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
          </div>
        </header>
        <div className="flex flex-row w-full h-full justify-center ">
          <div className="w-[80%] md:w-[90%]">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Viewhead({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div>
      <Header />
      <div className="text-white flex flex-row justify-center w-full h-full bg-gradient-to-bl from-gttpurple to-gttblack  min-h-screen">
        <div className="w-[80%] md:w-[65rem]">{children}</div>
      </div>
    </div>
  );
}

export function Viewheadonly({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div>
      <Header />
      <div>{children}</div>
    </div>
  );
}
