"use client";

import Header from "../components/header";
import React from "react";

export function Viewc({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="text-white flex flex-row justify-center w-full h-full bg-gradient-to-bl from-black to-[#001429] min-h-screen">
      <div className="w-[80%] md:w-[65rem]">{children}</div>
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
      <div className="text-white flex flex-row justify-center w-full h-full bg-gradient-to-bl from-black to-[#001429] min-h-screen">
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
