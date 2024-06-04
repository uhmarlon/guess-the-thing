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
    <div className="flex flex-wrap justify-center gap-2 text-lg md:grid md:grid-cols-2">
      {options.map((cocktailoptions) => (
        <button
          className={`rounded-lg w-full md:min-w-48 p-4 text-white ${
            clickedId === cocktailoptions.idDrink
              ? "bg-gttlightpurple"
              : "bg-gray-600 hover:bg-gray-700"
          } ${disabled && "bg-gray-800"}`}
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
