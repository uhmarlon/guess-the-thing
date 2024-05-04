"use client";
import { useRouter } from "next/navigation";
import { Viewhead } from "../../../../components/viewc";
import React from "react";

export default function Page(): JSX.Element {
  const router = useRouter();

  // Function to generate a random alphanumeric string
  const generateRandomString = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < 15; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  // Function to handle button click
  const handleButtonClick = () => {
    const randomString = generateRandomString();
    router.push(`/game/multi/flag/${randomString}`);
  };

  return (
    <Viewhead>
      <main>
        <div className="mt-32">
          <div className="relative mt-16 mb-32 max-w-lg mx-auto">
            <div className="rounded overflow-hidden shadow-md bg-[#8A24FF]">
              <button
                className="p-4 bg-blue-500 text-white rounded"
                onClick={handleButtonClick}
              >
                Generate and go to URL
              </button>
            </div>
          </div>
        </div>
      </main>
    </Viewhead>
  );
}
