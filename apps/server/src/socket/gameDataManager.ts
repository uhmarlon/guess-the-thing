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

  removePlayerFromLobby(lobbyId: string, playerId: string): void {
    const lobby = this.getLobbyById(lobbyId);
    if (lobby) {
      lobby.players = lobby.players.filter((player) => player.id !== playerId);
    }
  }
}

export default GameDataManager;
