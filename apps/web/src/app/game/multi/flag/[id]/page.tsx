"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { socket } from "../../../../../utils/game-socket";
import { getOrCreateGuestToken } from "../../../../../lib/guest/getToken";
import { Viewc } from "../../../../../components/viewc";
import QuizEntry from "../../../../../components/game/QuizEntryProps";
import UserInfo from "../../../../../components/ds/username";
import Link from "next/link";
import GameSettings from "../../../../../components/game/flag/GameSettings";

type Player = {
  id: string;
  name: string;
  points: number;
  level: number;
  loggedIn?: boolean;
  isHost?: boolean;
};

type gameLobbyClientInfo = {
  id: string;
  gamekey: string;
  hostIdplayer: string;
  playersinfo: Player[];
};

export default function Page(): JSX.Element {
  const { data: session } = useSession();
  const [imHost, setImHost] = useState(false);

  const router = useParams();
  const [players, setPlayers] = useState<gameLobbyClientInfo>({
    id: "",
    gamekey: "",
    hostIdplayer: "",
    playersinfo: [],
  });

  useEffect(() => {
    const gustid = getOrCreateGuestToken("guestToken");
    if (session?.user?.id) {
      socket.emit("join", router.id, "multi", "flag", session.user.id);
    } else {
      socket.emit("join", router.id, "multi", "flag", gustid);
    }

    socket.on("gamelobbyinfo", (data) => {
      setPlayers(data);
      const host = data.playersinfo.find((player: Player) => player.isHost);
      if (host?.id === session?.user?.id) {
        setImHost(true);
      }
      if (host?.id === gustid) {
        setImHost(true);
      }
    });

    return () => {
      socket.off("gamelobbyinfo");
    };
  }, [session, router.id]);

  return (
    <Viewc>
      <main>
        <div className="mt-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 ">
            <div className="col-span-1 sm:col-start-4">
              <QuizEntry gameId={players.gamekey} url="www.localhost:3000" />
            </div>
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 sm:row-start-1 sm:col-start-1">
              <h1 className="text-lg font-bold mt-2 sm:text-4xl">
                Guess The Flag
              </h1>
              <p className="text-sm pb-2">
                Guess the flag of the country based on the image shown.
              </p>
              {!session?.user && (
                <div className="bg-red-500 text-white p-2 rounded mt-2 max-w-sm ">
                  <p className="text-sm flex flex-row">
                    <Link href="/" className="text-white underline ml-1">
                      Login
                    </Link>
                    &nbsp;to sync your rank and points with your account
                  </p>
                </div>
              )}

              <div className="mt-4">
                <h2 className="text-lg font-bold">Player List</h2>
                <ul>
                  {players.playersinfo.map((player) => (
                    <li key={player.id}>
                      {/*  if player is host  */}
                      <div className="flex flex-row">
                        <UserInfo name={player.name} level={player.level} />
                        {player.isHost && (
                          <p className="text-xs">&nbsp; Host</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-500 my-2 max-w-md"></div>
                <ul className="text-sm">
                  {players.playersinfo.length} players
                </ul>
              </div>

              {imHost ? (
                <GameSettings isHost={true} lobbyid={players.id} />
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </Viewc>
  );
}
