// ExampleGame.ts
import BaseGame from "../BaseGame";
import { Lobby } from "../../../utlis/gametype";

class ExampleGame extends BaseGame {
  constructor(lobby: Lobby) {
    super(lobby);
  }

  startGame(): void {
    console.log("Starting Example Game for lobby:", this.lobby.id);
    this.lobby.gameState = "inGame";
    this.updateLobby(); // Reflect the game state change+

    console.log(this.lobby);
  }

  endGame(): void {
    console.log("Ending Example Game for lobby:", this.lobby.id);
    this.lobby.gameState = "postGame";
    this.updateLobby(); // Reflect the game state change
  }
}

export default ExampleGame;
