import BaseGame from "./BaseGame";
import ExampleGame from "./example/ExampleGame";
import { Lobby } from "../../utlis/gametype";

class GameFactory {
  static createGame(lobby: Lobby): BaseGame {
    switch (lobby.gameMode) {
      case "flag":
        return new ExampleGame(lobby);
      //case "anotherGameType":
      //return new AnotherGameType(lobby);
      // Add more cases as new games are developed
      default:
        throw new Error("Unsupported game mode: " + lobby.gameMode);
    }
  }
}

export default GameFactory;
