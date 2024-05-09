"use client";
//import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
//import { useParams } from "next/navigation";
import { socket } from "@utils/game-socket";
import { Viewc } from "@components/viewc";
import { GameState } from "src/utils/types/game";
import LobbyComponent from "@components/game/LobbyComponent";
//import StartCounter from "@components/game/StartCounter";
import FlagGameScreen from "@components/game/flag/GameScreen";

export default function Page(): JSX.Element {
  //const { data: session } = useSession();
  //const router = useParams();
  const [gameState, setGameState] = useState<GameState>(GameState.LOBBY);

  useEffect(() => {
    socket.on("gameStart", () => {
      setGameState(GameState.START_COUNTER);
      console.log("Game started");
    });
    socket.on("endGame", () => {
      setGameState(GameState.END);
    });

    return () => {
      socket.off("startGame");
      socket.off("endGame");
    };
  }, []);

  function renderGameComponent() {
    switch (gameState) {
      case GameState.LOBBY:
        return <LobbyComponent />;
      case GameState.START_COUNTER:
        return <FlagGameScreen />;
      // case GameState.GAME:
      //   return <GameComponent onGameEnd={() => setGameState(GameState.END)} />;
      // case GameState.END:
      //   return (
      //     <EndGameComponent onRestart={() => setGameState(GameState.LOBBY)} />
      //   );
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
