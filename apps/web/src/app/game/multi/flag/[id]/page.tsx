"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { socket } from "../../../../../utils/game-socket";
import { getOrCreateGuestToken } from "../../../../../lib/guest/getToken";
import { Viewc } from "../../../../../components/viewc";
import Button from "../../../../../components/ds/button";
import QuizEntry from "../../../../../components/game/QuizEntryProps";

interface Player {
  id: string;
  name: string;
}

export default function Page(): JSX.Element {
  const { data: session } = useSession();
  const router = useParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameId, setGameId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      socket.emit("join", router.id, "multi", "flag", session.user.id);
    } else {
      socket.emit(
        "join",
        router.id,
        "multi",
        "flag",
        getOrCreateGuestToken("guestToken")
      );
    }

    socket.on("player", (data: Player[]) => {
      setPlayers(data);
    });

    socket.on("gamekey", (data: string) => {
      setGameId(data);
    });

    // Clean up the socket listener when the component unmounts
    return () => {
      socket.off("player");
      socket.off("gamekey");
    };
  }, [session, router.id]);

  return (
    <Viewc>
      <main>
        <div className="mt-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 ">
            <div className="col-span-1 sm:col-start-4">
              <QuizEntry gameId={gameId} url="www.localhost:3000" />
            </div>
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 sm:row-start-1 sm:col-start-1">
              <h1 className="text-lg font-bold mt-2 sm:text-4xl">
                Guess The Flag
              </h1>
              <p className="text-sm pb-2">
                Guess the flag of the country based on the image shown.
              </p>

              <div className="mt-4">
                <h2 className="text-lg font-bold">Player List</h2>
                <p>{players.length} players in the lobby</p>
                {players.length > 0 ? (
                  <ul>
                    {players.map((player) => (
                      <li key={player.id}>{player.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No players connected yet.</p>
                )}
              </div>

              {/* <p className="text-lg text-center font-medium">Host settings</p>
              <div className="p-2">
                <select
                  className="block w-full bg-gray-800 text-white border border-gray-700 rounded-md py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-900 focus:border-gray-900"
                  id="grid-state"
                  value="5"
                  // onChange={(e) => setRound(parseInt(e.target.value))}
                >
                  <option value={5}>5 rounds</option>
                  <option value={10}>10 rounds</option>
                  <option value={15}>15 rounds</option>
                </select>
                <input
                  type="number"
                  className="block w-full bg-gray-800 text-white border border-gray-700 rounded-md py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-900 focus:border-gray-900"
                  id="round-time"
                  min={1}
                  max={60}
                  placeholder="Max Round Time (seconds)"
                />
              </div> */}
            </div>
          </div>
        </div>
      </main>
    </Viewc>
  );
}
