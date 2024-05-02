"use client";
import React from "react";

type ButtonProps = {
  bgColor?: string;
  borderColor?: string;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  bgColor = "bg-gttred/80",
  borderColor = "border-gttred/20",
  children,
}) => {
  return (
    <button
      className={`rounded-full border ${borderColor} ${bgColor} px-4 py-2 text-center font-medium text-white backdrop-blur-sm pointer-events-auto`}
    >
      {children}
    </button>
  );
};

export default Button;
