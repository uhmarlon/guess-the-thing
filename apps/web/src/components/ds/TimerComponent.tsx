"use client";
import React, { useEffect, useState, useRef } from "react";

// Use the correct path to your sound file in the public directory
const soundFile = "/sounds/timer.mp3";

export default function TimerComponent({
  maxTime,
  round,
  playSound = false, // Add a new prop for controlling sound playback
}: {
  maxTime: number;
  round: number;
  playSound?: boolean; // Make playSound an optional prop
}) {
  const intervalTime = 100;
  const [timeLeft, setTimeLeft] = useState(maxTime * 1000);
  const audioRef = useRef<HTMLAudioElement>(null); // Create a reference for the audio element

  useEffect(() => {
    if (!Number.isFinite(maxTime)) {
      console.error("Invalid maxTime received:", maxTime);
      return;
    }
    setTimeLeft(maxTime * 1000);

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - intervalTime, 0));
    }, intervalTime);

    return () => clearInterval(timerId);
  }, [maxTime, round]);

  useEffect(() => {
    if (playSound && timeLeft <= 3000 && timeLeft > 0 && audioRef.current) {
      audioRef.current.play();
    }
  }, [timeLeft, playSound]);

  const totalLength = 475;
  const dashOffset = ((1 - timeLeft / (maxTime * 1000)) * totalLength).toFixed(
    0
  );

  return (
    <div className="relative flex justify-center items-center w-full h-full">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 80"
        preserveAspectRatio="none"
      >
        <path
          fill="rgba(138 36 255 / 0.3)"
          stroke="#CC2936"
          strokeWidth="8"
          d="M38.56,4C19.55,4,4,20.2,4,40c0,19.8,15.55,36,34.56,36h122.88C180.45,76,196,59.8,196,40c0-19.8-15.55-36-34.56-36H38.56z"
          style={{
            strokeDasharray: totalLength,
            strokeDashoffset: dashOffset,
            stroke: "rgb(138 36 255 / 0.8)",
            transition: "stroke-dashoffset 0.05s linear",
          }}
        ></path>
        <text
          x="50%"
          y="55%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontSize="55"
        >
          {Math.ceil(timeLeft / 1000) < 10
            ? `00:0${Math.ceil(timeLeft / 1000)}`
            : `00:${Math.ceil(timeLeft / 1000)}`}
        </text>
      </svg>
      {playSound && <audio ref={audioRef} src={soundFile} />}
    </div>
  );
}
