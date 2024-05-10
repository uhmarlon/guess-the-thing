// BaseGame.ts
import { Lobby } from "../../utlis/gametype";
import GameDataManager from "../gameDataManager";

abstract class BaseGame {
  protected lobby: Lobby;
  protected gameDataManager: GameDataManager;

  constructor(lobby: Lobby) {
    this.lobby = lobby;
    this.gameDataManager = GameDataManager.getInstance();
  }

  // Methods that must be implemented by all games
  abstract startGame(): void;
  abstract endGame(): void;

  // A method to update the lobby information in GameDataManager
  protected async updateLobby(): Promise<void> {
    this.gameDataManager.updateLobby(this.lobby);
  }
}

export default BaseGame;
