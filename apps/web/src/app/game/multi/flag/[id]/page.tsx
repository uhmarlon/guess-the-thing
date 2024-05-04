"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { socket } from "../../../../../utils/game-socket";
import { getOrCreateGuestToken } from "../../../../../lib/guest/getToken";
import { Viewhead } from "../../../../../components/viewc";
import Button from "../../../../../components/ds/button";

interface Player {
  id: string;
  name: string;
}

export default function Page(): JSX.Element {
  const { data: session } = useSession();
  const router = useParams();
  const [players, setPlayers] = useState<Player[]>([]);

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

    // Clean up the socket listener when the component unmounts
    return () => {
      socket.off("player");
    };
  }, [session, router.id]);

  return (
    <Viewhead>
      <main>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl font-bold">{session?.user?.id || "Guest"}</h1>
          <div className="p-2">
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
          <div onClick={() => signIn()} className="p-2">
            <Button
              bgColor="bg-gttlightblue/80"
              borderColor="border-gttlightblue"
            >
              Click here to sign in
            </Button>
          </div>
        </div>
      </main>
    </Viewhead>
  );
}
