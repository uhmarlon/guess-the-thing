"use client";

import Header from "../components/header";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "./footer";

export function Viewc({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow text-white bg-gradient-to-bl from-gttpurple to-gttblack">
        <header className="p-2">
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
        <div className="flex flex-row w-full h-full justify-center text-white">
          <div className="w-[80%] md:w-[90%]">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export function Viewhead({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex justify-center w-full bg-gradient-to-bl from-gttpurple to-gttblack text-white">
        <div className="w-[92%] md:w-[65rem]">{children}</div>
      </div>
      <Footer />
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
