"use client";
import { useRouter } from "next/navigation";
import { Viewhead } from "../../../../components/viewc";
import React from "react";

export default function Page(): JSX.Element {
  const router = useRouter();

  // Function to generate a random alphanumeric string
  const generateFormattedString = () => {
    const generateRandomString = (length: number) => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    };

    return `${generateRandomString(7)}-${generateRandomString(4)}-${generateRandomString(4)}-${generateRandomString(4)}-${generateRandomString(7)}`;
  };

  // Function to handle button click
  const handleButtonClick = () => {
    const randomString = generateFormattedString();
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
