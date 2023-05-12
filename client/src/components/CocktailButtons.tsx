import React, { useState, useEffect } from 'react';
import { socket } from '../pages/gusstheflag';

interface Props {
  active: boolean;
  cocktailArray: any[];
}

const CocktailButtons: React.FC<Props> = ({ active, cocktailArray }) => {
  const [disabled, setDisabled] = useState(false);
  const [clickedId, setClickedId] = useState<number | null>(null);

  useEffect(() => {
    if (active) {
      setDisabled(false);
    }
  }, [active]);


  const handleClick = (idDrink: number) => {
    setDisabled(true);
    socket.emit('cocktailguss', idDrink);
    setClickedId(idDrink);
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-lg'>
      {cocktailArray.map((cocktail) => (
        <button
          disabled={!active || disabled}
          key={cocktail.idDrink}
          onClick={() => handleClick(cocktail.idDrink)}
          className={`rounded-lg w-full max-md:p-4 md:w-72 h-14 ${
            clickedId === cocktail.idDrink
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 disabled:bg-gray-800 text-white'
          }`}
        >
          {cocktail.strDrink}
        </button>
      ))}
    </div>
  );
};

export default CocktailButtons;