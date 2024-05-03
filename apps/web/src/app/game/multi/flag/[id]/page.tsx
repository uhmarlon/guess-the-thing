"use client";
import { signIn } from "next-auth/react";
import { Viewhead } from "../../../../../components/viewc";
import Button from "../../../../../components/ds/button";
import { socket } from "../../../../../utils/game-socket";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

//set cookie and load cookie

const generateGuestToken = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return (
    "gust-" +
    Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  );
};

export default function Page(): JSX.Element {
  const { data: session } = useSession();
  const router = useParams();

  if (session?.user?.id) {
    socket.emit("join", router.id, "multi", "flag", session.user.id);
  } else {
    const guestToken = generateGuestToken();
    socket.emit("join", router.id, "multi", "flag", guestToken);
  }

  useEffect(() => {
    socket.on("players", (players) => {
      console.log(players);
    });
  }, []);

  return (
    <Viewhead>
      <main>
        <div>
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">{session?.user.id}</h1>
            <div onClick={() => signIn()} className="p-2">
              <Button
                bgColor="bg-gttlightblue/80"
                borderColor="border-gttlightblue"
              >
                Click here to sign in
              </Button>
            </div>
          </div>
        </div>
      </main>
    </Viewhead>
  );
}
