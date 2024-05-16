import BaseGame from "./BaseGame";
import FlagGame from "./flag/FlagGame";
import { Lobby } from "../../utlis/gametype";
import DrinkGame from "./drink/DrinkGame";

class GameFactory {
  static createGame(lobby: Lobby, language: "en" | "de"): BaseGame {
    switch (lobby.gameMode) {
      case "flag":
        return new FlagGame(lobby, language);
      case "drink":
        return new DrinkGame(lobby, "en");
      //case "anotherGameType":
      //return new AnotherGameType(lobby);
      // Add more cases as new games are developed
      default:
        throw new Error("Unsupported game mode: " + lobby.gameMode);
    }
  }
}

export default GameFactory;
