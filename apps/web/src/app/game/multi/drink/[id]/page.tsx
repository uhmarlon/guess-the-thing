"use client";
import { useEffect, useState } from "react";
import { socket } from "@utils/game-socket";
import { Viewc } from "@components/viewc";
import { GameState } from "src/utils/types/game";
import LobbyComponent from "src/components/game/drink/LobbyComponent";
import StartCounter from "@components/game/StartCounter";
import FlagGameScreen from "@components/game/drink/GameScreen";
import FlagGameEnd from "@components/game/drink/GameEndScreen";

export default function Page(): JSX.Element {
  const [gameState, setGameState] = useState<GameState>(GameState.LOBBY);

  useEffect(() => {
    socket.on("gameLobby", () => {
      setGameState(GameState.END);
    });
    socket.on("gameCounter", () => {
      setGameState(GameState.START_COUNTER);
    });
    socket.on("gameScreen", () => {
      setGameState(GameState.GAME);
    });
    socket.on("gameEnd", () => {
      setGameState(GameState.END);
    });

    return () => {
      socket.off("gameLobby");
      socket.off("gameCounter");
      socket.off("gameScreen");
      socket.off("gameEnd");
    };
  }, []);

  function renderGameComponent() {
    switch (gameState) {
      case GameState.LOBBY:
        return <LobbyComponent />;
      case GameState.START_COUNTER:
        return <StartCounter />;
      case GameState.GAME:
        return <FlagGameScreen />;
      case GameState.END:
        return <FlagGameEnd />;
      default:
        return <div>Unknown state</div>;
    }
  }

  return (
    <Viewc>
      <main>{renderGameComponent()}</main>
    </Viewc>
  );
}
