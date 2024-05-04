"use client";
import { signIn } from "next-auth/react";
import { Viewhead } from "../../../../../components/viewc";
import Button from "../../../../../components/ds/button";
import { socket } from "../../../../../utils/game-socket";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function checkifavlidlocalstorgeiteam(test: string) {
  const guestToken = "gust-" + Math.random().toString(36).substring(2);
  if (localStorage.getItem(test) === null) {
    localStorage.setItem(test, guestToken);
  } else {
    if (localStorage.getItem(test).includes("gust-") === false) {
      localStorage.setItem(test, guestToken);
    }
    if (localStorage.getItem(test).startsWith("gust-") === false) {
      localStorage.setItem(test, guestToken);
    }
    return localStorage.getItem(test) as string;
  }
}

export default function Page(): JSX.Element {
  const { data: session } = useSession();
  const router = useParams();

  useEffect(() => {
    if (session?.user?.id) {
      socket.emit("join", router.id, "multi", "flag", session.user.id);
    } else {
      socket.emit(
        "join",
        router.id,
        "multi",
        "flag",
        checkifavlidlocalstorgeiteam("guestToken")
      );
    }
  }, [session]); // Emit only when session or router.id changes

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
