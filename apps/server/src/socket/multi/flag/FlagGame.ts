import BaseGame from "../BaseGame";
import { Lobby } from "../../../utlis/gametype";
import { io } from "../../../server";
import flags_en from "@data/flags/en_us.json";

type FlagData = {
  [key: string]: string;
};

class FlagGame extends BaseGame {
  constructor(lobby: Lobby) {
    super(lobby);
  }

  async startGame(): Promise<void> {
    console.log("Starting Flag Game for lobby:", this.lobby);
    io.to(this.lobby.id).emit("gameCounter");
    setTimeout(() => {
      this.lobby.gameState = "inGame";
      this.updateLobby();
    }, 3000);
    setTimeout(() => {
      io.to(this.lobby.id).emit("gameScreen");
    }, 5000);
  }

  async gameLoop(): Promise<void> {
    this.updateLobby();
  }

  async getRandomFlag(previousFlag: string): Promise<FlagData> {
    const flags = flags_en;
    let flag = flags[Math.floor(Math.random() * flags.length)];
    while (flag.name === previousFlag) {
      flag = flags[Math.floor(Math.random() * flags.length)];
    }
    return flag;
  }

  async endGame(): Promise<void> {
    console.log("Ending Example Game for lobby:", this.lobby.id);
    this.lobby.gameState = "postGame";
    this.updateLobby();
  }
}

export default FlagGame;
