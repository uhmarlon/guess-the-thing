"use client";
import { Viewheadonly } from "@components/viewc";
import FlagGameEnd from "@components/game/flag/GameEndScreen";

export default function Page(): JSX.Element {
  return (
    <Viewheadonly>
      <main>{FlagGameEnd()}</main>
    </Viewheadonly>
  );
}
