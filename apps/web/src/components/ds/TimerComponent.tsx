"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";

const soundFile = "/sounds/timer.mp3";

export default function TimerComponent({
  maxTime,
  round,
  playSound = false,
}: {
  maxTime: number;
  round: number;
  playSound?: boolean;
}) {
  const intervalTime = 100;
  const [timeLeft, setTimeLeft] = useState(maxTime * 1000);
  const [shouldPlaySound, setShouldPlaySound] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    const endTime = Date.now() + maxTime * 1000;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      const newTimeLeft = Math.max(endTime - Date.now(), 0);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
      }
    }, intervalTime);
  }, [maxTime]);

  useEffect(() => {
    setTimeLeft(maxTime * 1000);
    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [maxTime, round, startTimer]);

  useEffect(() => {
    if (playSound && timeLeft <= 3098 && timeLeft > 0) {
      setShouldPlaySound(true);
    } else {
      setShouldPlaySound(false);
    }

    if (timeLeft === 0 && playSound) {
      setShouldPlaySound(false);
    }
  }, [timeLeft, playSound]);

  useEffect(() => {
    if (shouldPlaySound && audioRef.current && audioRef.current.paused) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch((error) => {
        console.error("Audio play failed:", error);
      });
    }

    if (!shouldPlaySound && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [shouldPlaySound]);

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
            transition: "stroke-dashoffset 0.1s linear",
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
      <audio ref={audioRef} src={soundFile} />
    </div>
  );
}
