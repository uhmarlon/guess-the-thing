import { GameData, Lobby, Player } from "../utlis/gametype";

class GameDataManager {
  private static instance: GameDataManager;
  private gameData: GameData;

  private constructor() {
    this.gameData = { lobbies: [] };
  }

  public static getInstance(): GameDataManager {
    if (!GameDataManager.instance) {
      GameDataManager.instance = new GameDataManager();
    }
    return GameDataManager.instance;
  }
  getLobbies(): Lobby[] {
    return this.gameData.lobbies;
  }

  generateGameCode(): string {
    let code = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 4; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    if (this.gameData.lobbies.find((lobby) => lobby.gamekey === code)) {
      return this.generateGameCode();
    }
    return code;
  }

  getLobbyById(lobbyId: string): Lobby | undefined {
    return this.gameData.lobbies.find((lobby) => lobby.id === lobbyId);
  }

  addLobby(lobby: Lobby): void {
    this.gameData.lobbies.push(lobby);
  }

  removeLobby(lobbyId: string): void {
    this.gameData.lobbies = this.gameData.lobbies.filter(
      (lobby) => lobby.id !== lobbyId
    );
  }

  addPlayerToLobby(lobbyId: string, player: Player): void {
    const lobby = this.getLobbyById(lobbyId);
    if (lobby && !lobby.players.find((p) => p.id === player.id)) {
      lobby.players.push(player);
    }
  }

  updateLobby(updatedLobby: Lobby): void {
    const index = this.gameData.lobbies.findIndex(
      (lobby) => lobby.id === updatedLobby.id
    );
    if (index !== -1) {
      this.gameData.lobbies[index] = updatedLobby;
    }
  }

  removePlayerFromLobby(lobbyId: string, playerId: string): void {
    const lobby = this.getLobbyById(lobbyId);
    if (lobby) {
      lobby.players = lobby.players.filter((player) => player.id !== playerId);
    }
  }
}

export default GameDataManager;
