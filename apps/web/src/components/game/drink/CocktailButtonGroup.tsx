"use client";
import React, { useState, useEffect, useCallback } from "react";
import { socket } from "../../../utils/game-socket";
import { useParams } from "next/navigation";

interface CocktailButtonProps {
  active: boolean;
  options: {
    idDrink: string;
    strDrink: string;
  }[];
}

const CocktailButtons: React.FC<CocktailButtonProps> = ({
  active,
  options,
}) => {
  const [disabled, setDisabled] = useState(false);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const router = useParams();

  useEffect(() => {
    if (options.length > 0) {
      setDisabled(false);
      setClickedId(null);
    }
  }, [options]);

  const handleClick = useCallback(
    (idDrink: string): void => {
      setDisabled(true);
      const data = {
        lobbyId: router.id,
        answer: idDrink,
      };
      socket.emit("answerHandel", data);
      setClickedId(idDrink);
    },
    [router.id]
  );

  return (
    <div className="flex flex-wrap justify-center gap-3 text-lg">
      {options.map((cocktailoptions) => (
        <button
          className={`rounded-lg w-full max-w-xs p-4 ${
            clickedId === cocktailoptions.idDrink
              ? "bg-blue-600 text-white"
              : "bg-gray-600 text-white"
          } ${!active || disabled ? "disabled:bg-gray-800" : ""}`}
          disabled={!active || disabled}
          key={cocktailoptions.idDrink}
          onClick={() => handleClick(cocktailoptions.idDrink)}
          type="button"
        >
          {cocktailoptions.strDrink}
        </button>
      ))}
    </div>
  );
};

export default CocktailButtons;
