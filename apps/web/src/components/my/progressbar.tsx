"use client";
import { motion } from "framer-motion";

export function Levelprogressbar({
  currentPoints,
  rangeStart,
  rangeEnd,
}: {
  currentPoints: number;
  rangeStart: number;
  rangeEnd: number;
}): JSX.Element {
  const percentage =
    ((currentPoints - rangeStart) / (rangeEnd - rangeStart)) * 100;
  const formattedPercentage = Math.min(Math.max(percentage, 0), 100).toFixed(0);

  return (
    <div className="relative mb-5 pt-1">
      <div className="flex h-5 overflow-hidden rounded bg-gttblack text-xs">
        <motion.div
          className="bg-gttgold"
          initial={{ width: "0%" }}
          animate={{ width: `${formattedPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        ></motion.div>
      </div>
      <div className="flex mb-2 items-center justify-between text-xs">
        <div className="text-white">{rangeStart}p</div>
        <div className="text-white">{rangeEnd}p</div>
      </div>
    </div>
  );
}
