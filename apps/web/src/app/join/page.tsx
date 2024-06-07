"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Viewc } from "src/components/viewc";
import { useRouter, useSearchParams } from "next/navigation";
import { getBackendURL } from "../../utils/game-api";

// Composant séparé pour le contenu principal
function Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(new Array(4).fill(""));
  const [gameToken, setGameToken] = useState<string | null>(null);

  const firstInputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);
  const thirdInputRef = useRef<HTMLInputElement>(null);
  const fourthInputRef = useRef<HTMLInputElement>(null);

  const inputRefs = [
    firstInputRef,
    secondInputRef,
    thirdInputRef,
    fourthInputRef,
  ];

  const fetchGameToken = async (fullCode: string) => {
    try {
      const response = await fetch(
        `${getBackendURL()}/join?code=${fullCode.toUpperCase()}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch game token");
      }
      const data = await response.json();
      setGameToken(data.lobbyId);
      router.push(`/game/multi/${data.game}/${data.lobbyId}`);
    } catch (error) {
      console.error("Error fetching game token:", error);
    }
  };

  const handleInput = (value: string, index: number) => {
    const newCode = [...code];
    const upperValue = value.toUpperCase();

    if (value.length > 1) {
      const pastedValues = value.split("").slice(0, 4 - index);
      pastedValues.forEach((char, i) => {
        newCode[index + i] = char.toUpperCase();
      });
      setCode(newCode);
      if (newCode.every((digit) => digit !== "")) {
        fetchGameToken(newCode.join(""));
      } else {
        inputRefs[Math.min(index + pastedValues.length, 3)].current?.focus();
      }
      return;
    }

    newCode[index] = upperValue;
    setCode(newCode);

    if (upperValue && index < 3) {
      inputRefs[index + 1].current?.focus();
    } else if (index === 3 && newCode.every((digit) => digit !== "")) {
      fetchGameToken(newCode.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  useEffect(() => {
    const initialCode = searchParams.get("c");
    if (initialCode && initialCode.length === 4) {
      const initialCodeArray = initialCode.toUpperCase().split("");
      setCode(initialCodeArray);
      if (initialCodeArray.every((digit) => digit !== "")) {
        fetchGameToken(initialCodeArray.join(""));
      }
    }
    firstInputRef.current?.focus();
  }, [fetchGameToken, searchParams]);

  return (
    <div className="text-center text-white text-sm md:text-lg">
      <div className="space-x-2 md:space-x-4 p-4 rounded-lg pt-2">
        {code.map((digit, index) => (
          <motion.input
            key={index}
            ref={inputRefs[index]}
            className="w-14 h-14 md:w-32 md:h-32 text-center text-2xl md:text-6xl border-4 border-gttlightpurple bg-gttpurple rounded-lg"
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInput(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => handleInput(e.clipboardData.getData("Text"), index)}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>
      {gameToken && (
        <p className="text-center text-lg text-white">
          Game Token: {gameToken}
        </p>
      )}
    </div>
  );
}

// Composant principal
export default function Page(): JSX.Element {
  return (
    <Viewc>
      <main className="justify-center">
        <h1 className="text-1xl md:text-2xl text-center font-bold text-white pt-[32vh]">
          Enter the code
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <Content />
        </Suspense>
      </main>
    </Viewc>
  );
}
