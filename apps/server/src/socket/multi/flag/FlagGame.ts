import BaseGame from "../BaseGame";
import { Lobby } from "../../../utlis/gametype";
import { io } from "../../../server";

class FlagGame extends BaseGame {
  constructor(lobby: Lobby) {
    super(lobby);
  }

  startGame(): void {
    console.log("Starting Example Game for lobby:", this.lobby.id);
    // emit to lobby that game has started io.to("some room").emit("some event");
    io.to(this.lobby.id).emit("gameStart");

    this.lobby.gameState = "inGame";
    this.updateLobby(); // Reflect the game state change+
    // wait 1 second
    setTimeout(() => {
      io.to(this.lobby.id).emit("startCounter");
    }, 1000);

    console.log(this.lobby);
  }

  endGame(): void {
    console.log("Ending Example Game for lobby:", this.lobby.id);
    this.lobby.gameState = "postGame";
    this.updateLobby();
  }
}

export default FlagGame;
