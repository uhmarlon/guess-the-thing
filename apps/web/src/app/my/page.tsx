"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Viewhead } from "../../components/viewc";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Levelprogressbar } from "../../components/my/progressbar";
import Button from "../../components/ds/button";
import UserInfo from "../../components/ds/username";

export default function Page(): JSX.Element {
  const { data: session } = useSession();
  const [currentPoints, setCurrentPoints] = useState(0);
  const [startPoints, setStartPoints] = useState(0);
  const [level, setlevel] = useState(0);
  const [endPoints, setEndPoints] = useState(100);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (session) {
        try {
          const response = await fetch(`http://localhost:3005/player/level`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.user.id}`,
            },
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          setCurrentPoints(data.currentPoints);
          setStartPoints(data.rangeStart);
          setEndPoints(data.rangeEnd);
          setlevel(data.currentLevel);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchUserData();
  }, [session]);

  return (
    <Viewhead>
      <main>
        {session?.user ? (
          <div className="mt-32">
            <div className="relative mt-16 mb-32 max-w-lg mx-auto">
              <div className="rounded overflow-hidden shadow-md bg-[#8A24FF]">
                <div className="absolute -mt-20 w-full flex justify-center">
                  <div className="h-32 w-32">
                    <Image
                      src={session.user.image ?? ""}
                      alt="profile"
                      width={100}
                      height={100}
                      className="rounded-full object-cover h-full w-full shadow-md border-gttblack border-4"
                    />
                  </div>
                </div>
                <div className="px-6 mt-16">
                  <h1 className="font-bold text-3xl text-center mb-1 flex justify-center items-center">
                    <UserInfo
                      name={session.user.name as string}
                      level={level}
                    />
                  </h1>

                  {loading ? (
                    <p className="text-center">Loading...</p>
                  ) : (
                    <div>
                      <div className="text-gray-200 text-sm text-center">
                        <p>Current Level: {level}</p>
                        <p>Points {currentPoints}</p>
                      </div>
                      <Levelprogressbar
                        currentPoints={currentPoints}
                        rangeStart={startPoints}
                        rangeEnd={endPoints}
                      />
                    </div>
                  )}

                  <p className="text-gray-200 text-[0.6rem] text-center">
                    id: {session.user.id}
                  </p>
                  <div
                    className="text-center pb-4 pt-2"
                    onClick={() => signOut()}
                  >
                    <Button
                      bgColor="bg-gttred/80"
                      borderColor="border-gttred/20"
                    >
                      Sign out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-4xl font-bold">You need to sign in</h1>
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
        )}
      </main>
    </Viewhead>
  );
}
