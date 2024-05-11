"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Viewc } from "src/components/viewc";

export default function Page(): JSX.Element {
  const [code, setCode] = useState(new Array(4).fill(""));

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

  const handleInput = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  return (
    <Viewc>
      <main className="justify-center">
        <h1 className="text-1xl md:text-2xl text-center font-bold text-white pt-[32vh]">
          Enter the code
        </h1>
        <div className="text-center text-white text-sm md:text-lg">
          <div className="space-x-2 md:space-x-4 p-4 rounded-lg pt-2">
            {code.map((digit, index) => (
              <motion.input
                key={index}
                ref={inputRefs[index]}
                className="w-14 h-14 md:w-32 md:h-32 text-center text-2xl md:text-6xl border-4  border-gttlightpurple bg-gttpurple rounded-lg"
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInput(e.target.value, index)}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </div>
      </main>
    </Viewc>
  );
}
