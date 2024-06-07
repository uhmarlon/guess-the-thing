"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { getOrCreateGuestToken } from "@lib/guest/getToken";
import QuizEntry from "@components/game/QuizEntryProps";
import UserInfo from "@components/ds/username";
import Link from "next/link";
import GameSettings from "@components/game/drink/GameSettings";
import { Player, gameLobbyClientInfo } from "@utils/types/game";
import RenameDialog from "src/components/ds/RenameDialog";

import { socket } from "@utils/game-socket";

export default function LobbyComponent(): JSX.Element {
  const { data: session, status } = useSession();
  const [imHost, setImHost] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useParams();
  const [players, setPlayers] = useState<gameLobbyClientInfo>({
    id: "",
    gamekey: "",
    hostIdplayer: "",
    playersinfo: [],
  });

  useEffect(() => {
    const gustid = getOrCreateGuestToken("guestToken");
    const userId = session?.user?.id || gustid;
    if (status !== "loading") {
      socket.emit("join", router.id, "multi", "drink", userId);

      socket.on("gamelobbyinfo", (data) => {
        setPlayers(data);
        const host = data.playersinfo.find((player: Player) => player.isHost);
        if (host?.id === userId) {
          setImHost(true);
        }
      });
    }

    return () => {
      socket.off("gamelobbyinfo");
    };
  }, [session, router.id, status]);

  return (
    <div className="mt-3">
      <div className="grid grid-cols-1 sm:grid-cols-4 ">
        <div className="col-span-1 sm:col-start-4">
          <QuizEntry gameId={players.gamekey} url="www.guessthething.io" />
        </div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 sm:row-start-1 sm:col-start-1">
          <h1 className="text-lg font-bold mt-2 sm:text-4xl">
            Guess The Drink
          </h1>
          <p className="text-sm pb-2">
            Guess the drink based on the image shown.
          </p>
          {!session?.user && (
            <div className="bg-red-500 text-white p-2 rounded mt-2 max-w-sm">
              <p className="text-sm flex flex-row">
                <Link href="/" className="text-white underline">
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
                  <div className="flex flex-row">
                    <UserInfo name={player.name} level={player.level} />
                    {player.isHost && <p className="text-xs">&nbsp; Host</p>}
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-500 my-2 max-w-md"></div>
            <ul className="text-sm">{players.playersinfo.length} players</ul>

            {!session?.user && (
              <div className="mt-2">
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Rename
                </button>
                <RenameDialog
                  isOpen={isDialogOpen}
                  onClose={() => setIsDialogOpen(false)}
                  onSubmit={() => {
                    setIsDialogOpen(false);
                  }}
                />
              </div>
            )}
          </div>

          {imHost ? <GameSettings isHost={true} lobbyid={players.id} /> : null}
        </div>
      </div>
    </div>
  );
}
