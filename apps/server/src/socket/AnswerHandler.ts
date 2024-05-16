// AnswerHandler.ts
import { Socket } from "socket.io";
import GameDataManager from "./gameDataManager";
import FlagGame from "./multi/flag/FlagGame";
// import DrinkGame from "./multi/drink/DrinkGame";

export class AnswerHandler {
  static bind(socket: Socket): void {
    const manager = GameDataManager.getInstance();

    socket.on("answerHandel", async (data) => {
      const lobby = manager.getLobbyById(data.lobbyId);
      if (lobby) {
        const game = lobby.gameMode;
        switch (game) {
          case "flag":
            FlagGame.answerHandel(socket, data, lobby);
            break;
          case "drink":
            // DrinkGame.answerHandel(socket, data, lobby);
            break;
          default:
            throw new Error("Unsupported game mode: " + lobby.gameMode);
        }
      }
    });
  }
}
