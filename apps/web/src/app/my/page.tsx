"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Viewhead } from "../../components/viewc";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Levelprogressbar } from "../../components/my/progressbar";

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
            <div className="relative mt-16 mb-32 max-w-sm mx-auto">
              <div className="rounded overflow-hidden shadow-md bg-[#515186]">
                <div className="absolute -mt-20 w-full flex justify-center">
                  <div className="h-32 w-32">
                    <Image
                      src={session.user.image ?? ""}
                      alt="profile"
                      width={128}
                      height={128}
                      className="rounded-full object-cover h-full w-full shadow-md"
                    />
                  </div>
                </div>
                <div className="px-6 mt-16">
                  <h1 className="font-bold text-3xl text-center mb-1">
                    {session.user.name?.toUpperCase()}
                  </h1>
                  <p className="text-gray-800 text-sm text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold  rounded-full bg-gray-700 text-blue-400">
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill="currentColor"
                          d="m18.774 8.245-.892-.893a1.5 1.5 0 0 1-.437-1.052V5.036a2.484 2.484 0 0 0-2.48-2.48H13.7a1.5 1.5 0 0 1-1.052-.438l-.893-.892a2.484 2.484 0 0 0-3.51 0l-.893.892a1.5 1.5 0 0 1-1.052.437H5.036a2.484 2.484 0 0 0-2.48 2.481V6.3a1.5 1.5 0 0 1-.438 1.052l-.892.893a2.484 2.484 0 0 0 0 3.51l.892.893a1.5 1.5 0 0 1 .437 1.052v1.264a2.484 2.484 0 0 0 2.481 2.481H6.3a1.5 1.5 0 0 1 1.052.437l.893.892a2.484 2.484 0 0 0 3.51 0l.893-.892a1.5 1.5 0 0 1 1.052-.437h1.264a2.484 2.484 0 0 0 2.481-2.48V13.7a1.5 1.5 0 0 1 .437-1.052l.892-.893a2.484 2.484 0 0 0 0-3.51Z"
                        />
                        <path
                          fill="#fff"
                          d="M8 13a1 1 0 0 1-.707-.293l-2-2a1 1 0 1 1 1.414-1.414l1.42 1.42 5.318-3.545a1 1 0 0 1 1.11 1.664l-6 4A1 1 0 0 1 8 13Z"
                        />
                      </svg>
                      <span className="sr-only">Icon description</span>
                    </span>
                  </p>
                  {loading ? (
                    <p className="text-center">Loading...</p>
                  ) : (
                    <>
                      <p className="text-gray-200 text-sm text-center">
                        Current Level: {level} / Points {currentPoints}
                      </p>
                      <Levelprogressbar
                        currentPoints={currentPoints}
                        rangeStart={startPoints}
                        rangeEnd={endPoints}
                      />
                    </>
                  )}

                  <p className="text-gray-200 text-sm text-center">
                    id: {session.user.id}
                  </p>
                  <div
                    className="text-red-600 text-center font-extrabold p-4 pointer-events-auto"
                    onClick={() => signOut()}
                  >
                    <button type="button">Logout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-4xl font-bold">You need to sign in</h1>
              <button
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
                onClick={() => signIn()}
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </main>
    </Viewhead>
  );
}
