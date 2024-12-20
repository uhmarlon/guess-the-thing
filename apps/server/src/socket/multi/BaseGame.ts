import { Lobby, Player } from "../../utlis/gametype";
import GameDataManager from "../gameDataManager";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { userLevels, gameStatistics } from "../../db/schema";

abstract class BaseGame {
  protected lobby: Lobby;
  protected gameDataManager: GameDataManager;

  constructor(lobby: Lobby) {
    this.lobby = lobby;
    this.gameDataManager = GameDataManager.getInstance();
  }

  abstract startGame(): void;
  abstract endGame(): void;

  protected async updateLobby(): Promise<void> {
    await this.gameDataManager.updateLobby(this.lobby);
  }

  protected async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  protected async initializeScores(): Promise<void> {
    if (
      !this.lobby.gameinside.scores ||
      this.lobby.gameinside.scores.length === 0
    ) {
      this.lobby.gameinside.scores = this.lobby.players.map((player) => ({
        playerId: player.id,
        score: 0,
        hasPlayed: false,
        correctRounds: 0,
        isReady: false,
      }));
    } else {
      this.lobby.gameinside.scores.forEach((player) => {
        player.hasPlayed = false;
        player.isReady = false;
      });
    }
    await this.updateLobby();
  }

  protected async addStatistics(
    player: Player,
    gamemodeID: number,
    language: string
  ): Promise<void> {
    const playerScore =
      this.lobby.gameinside.scores?.find((s) => s.playerId === player.id)
        ?.score || 0;

    const roundsPlayed = this.lobby.gameinside.round || 0;
    const correctRounds =
      this.lobby.gameinside.scores?.find((s) => s.playerId === player.id)
        ?.correctRounds || 0;

    try {
      await db.insert(gameStatistics).values({
        playerId: player.id,
        gameId: gamemodeID,
        score: playerScore,
        language: language,
        rounds_played: roundsPlayed,
        correct_rounds: correctRounds,
      });
    } catch (error) {
      console.error(
        "Failed to insert statistics:",
        error,
        "for user",
        player.id
      );
    }
  }

  protected async addXPLoginPlayer(player: Player): Promise<void> {
    const playerScore =
      this.lobby.gameinside.scores?.find((s) => s.playerId === player.id)
        ?.score || 0;
    const xpToAdd = Math.floor(playerScore / 2);

    try {
      const levelExists = await db
        .select()
        .from(userLevels)
        .where(eq(userLevels.userId, player.id));

      if (levelExists.length > 0) {
        await db
          .update(userLevels)
          .set({
            levelpoints: levelExists[0].levelpoints + xpToAdd,
          })
          .where(eq(userLevels.userId, player.id));
      } else {
        await db.insert(userLevels).values({
          userId: player.id,
          levelpoints: xpToAdd,
        });
      }
    } catch (error) {
      console.error("Failed to add/update XP:", error, "for user", player.id);
    }
  }
}

export default BaseGame;
