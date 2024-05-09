"use client";
import React, { useState, useEffect } from "react";

export default function TimerComponent({ maxTime }: { maxTime: number }) {
  const intervalTime = 80; // Intervallzeit in Millisekunden für glattere Animation
  const [timeLeft, setTimeLeft] = useState(maxTime * 1000); // Zeit in Millisekunden

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - intervalTime : 0));
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Berechnung für die Animation der SVG-Border
  const totalLength = 475; // Gesamtlänge des Pfads
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
          width="100%"
          height="100%"
          fill="rgba(138 36 255 / 0.3)"
          stroke="#CC2936"
          strokeWidth="8"
          d="M38.56,4C19.55,4,4,20.2,4,40c0,19.8,15.55,36,34.56,36h122.88C180.45,76,196,59.8,196,40c0-19.8-15.55-36-34.56-36H38.56z"
          style={{
            strokeDasharray: totalLength,
            strokeDashoffset: dashOffset,
            stroke: "rgb(138 36 255 / 0.8)",
            transition: "stroke-dashoffset 0.05s linear", // Glättet die Änderung der dashoffset
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
    </div>
  );
}
