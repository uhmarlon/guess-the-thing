import BaseGame from "../BaseGame";
import { Lobby } from "../../../utlis/gametype";
import { io } from "../../../server";
import { Socket } from "socket.io";
import * as flags_en from "../../../data/flags/en_us.json";
import * as flags_de from "../../../data/flags/de_de.json";
import { UserExists } from "../../../api/player/checks/exists";
import { db } from "../../../db";
import { eq } from "drizzle-orm";
import { userLevels } from "../../../db/schema";
import { Player } from "../../../utlis/gametype";

type FlagData = {
  [key: string]: string;
};

class FlagGame extends BaseGame {
  private usedFlags: Set<string> = new Set();
  private language: "en" | "de";

  constructor(lobby: Lobby, language: "en" | "de") {
    super(lobby);
    this.language = language;
  }

  async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async startGame(): Promise<void> {
    io.to(this.lobby.id).emit("gameCounter");
    await this.delay(3000);
    this.lobby.gameState = "inGame";
    this.updateLobby();
    await this.delay(2000);
    io.to(this.lobby.id).emit("gameScreen");
    this.gameLoop();
  }

  async gameLoop(): Promise<void> {
    for (let i = 0; i < (this.lobby.gameinside?.maxRounds || 5); i++) {
      this.lobby.gameinside.round = i + 1;
      const { maxTime, round, maxRounds } = this.lobby.gameinside;
      const gameInfo = { maxTime, round, maxRounds };
      await this.initializeScores();

      const flagData: FlagData = await this.getRandomFlag();
      const flagKey: string = Object.keys(flagData)[0];
      const flagValue: string = flagData[flagKey];
      const hiddenFlag = await this.hideString(flagValue);
      const inFlagData = {
        flagKey,
        flagValue: hiddenFlag,
      };
      console.log("flag " + flagValue);

      if (!this.lobby.gameinside.gameSpecial) {
        this.lobby.gameinside.gameSpecial = [{ i, flagValue }];
      } else {
        this.lobby.gameinside.gameSpecial[i] = { i, flagValue };
      }

      this.updateLobby();

      io.to(this.lobby.id).emit("flagData", inFlagData);
      io.to(this.lobby.id).emit("gameInfo", gameInfo);

      await this.wait(this.lobby.gameinside.maxTime);

      if (!this.lobby.gameinside.scores) {
        return;
      }
      const scoreboard = {
        flagString: flagValue,
        player: {
          username: this.lobby.players.map((player) => player.name),
          score: this.lobby.gameinside.scores.map((score) => score.score),
          level: this.lobby.players.map((player) => player.level),
        },
      };

      io.to(this.lobby.id).emit("scoreBoard", scoreboard);
      await this.delay(5000);

      if (i === (this.lobby.gameinside?.maxRounds ?? 0) - 1) {
        this.updateLobby();
        await this.endGame();
        return;
      }

      this.updateLobby();
    }
  }

  async wait(maxTime: number | undefined): Promise<void> {
    if (maxTime) {
      maxTime = maxTime * 1000;
    }
    const startTime = Date.now();
    let playersAnswered = 0;
    let allAnswered = false;
    while (!allAnswered && Date.now() - startTime < (maxTime || 30000)) {
      if (!this.lobby.gameinside.scores) {
        return;
      }
      playersAnswered = this.lobby.gameinside.scores.filter(
        (score) => score.hasPlayed
      ).length;
      allAnswered = playersAnswered === this.lobby.players.length;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  async hideString(input: string): Promise<string> {
    return input.replace(/[^ -]/g, "*");
  }

  static async answerHandel(
    socket: Socket,
    data: { lobbyId: string; answer: string },
    lobby: Lobby
  ): Promise<void> {
    try {
      const player = lobby.players.find((p) => p.socketId === socket.id);
      if (
        !player ||
        !lobby.gameinside.gameSpecial ||
        !lobby.gameinside.scores
      ) {
        return;
      }
      const lastFlagValue =
        lobby.gameinside.round &&
        lobby.gameinside.gameSpecial[lobby.gameinside.round - 1];
      if (
        data.answer.toLowerCase() ===
        (lastFlagValue as FlagData).flagValue.toLowerCase()
      ) {
        const playerScore = lobby.gameinside.scores.find(
          (score) => score.playerId === player.id
        );
        if (playerScore && !playerScore.hasPlayed) {
          const score = await FlagGame.rightAnswer(playerScore, lobby);
          const rdata = {
            score: score,
            flagValue: (lastFlagValue as FlagData).flagValue,
          };
          io.to(socket.id).emit("rightAnswer", rdata);
        }
      } else {
        return;
      }
    } catch (error) {
      console.error("Failed to handle answer:", error);
    }
  }

  static async rightAnswer(
    playerScore: {
      playerId: string;
      score: number;
      hasPlayed: boolean;
      isReady: boolean;
    },
    lobby: Lobby
  ): Promise<number> {
    if (!lobby.gameinside.scores) {
      return 0;
    }
    const playersAnswered = lobby.gameinside.scores.filter(
      (score) => score.hasPlayed
    ).length;
    const multiplier = 1 + (lobby.players.length - playersAnswered) / 10;
    playerScore.score += Math.floor(50 * multiplier);
    playerScore.hasPlayed = true;
    return playerScore.score;
  }

  async initializeScores(): Promise<void> {
    if (
      !this.lobby.gameinside.scores ||
      this.lobby.gameinside.scores.length === 0
    ) {
      this.lobby.gameinside.scores = this.lobby.players.map((player) => ({
        playerId: player.id,
        score: 0,
        hasPlayed: false,
        isReady: false,
      }));
    } else {
      this.lobby.gameinside.scores.forEach((player) => {
        player.hasPlayed = false;
        player.isReady = false;
      });
    }
    this.updateLobby();
  }

  async getRandomFlag(): Promise<FlagData> {
    const flagData = this.language === "de" ? flags_de : flags_en;
    const flagKeys = Object.keys(flagData).filter(
      (key) => !this.usedFlags.has(key)
    );

    if (flagKeys.length === 0) {
      console.error("No more flags available");
      return {};
    }
    const newFlagKey = flagKeys[Math.floor(Math.random() * flagKeys.length)];
    this.usedFlags.add(newFlagKey);
    return { [newFlagKey]: flagData[newFlagKey as keyof typeof flagData] };
  }

  async endGame(): Promise<void> {
    this.lobby.gameState = "postGame";

    const anyPlayerHasScore =
      this.lobby.gameinside.scores?.some((score) => score.score > 0) || false;

    for (const player of this.lobby.players) {
      let score =
        this.lobby.gameinside.scores?.find((s) => s.playerId === player.id)
          ?.score || 0;
      if (!anyPlayerHasScore) {
        score = 0;
      }

      if (score > 0 && player.loggedIn) {
        const userExists = new UserExists();
        if (await userExists.checkUserExists(player.id)) {
          await this.addXPLoginPlayer(player);
        }
      }
    }

    const playerData = this.lobby.players.map((player) => {
      const score =
        this.lobby.gameinside.scores?.find((s) => s.playerId === player.id)
          ?.score || 0;
      const finalScore = anyPlayerHasScore ? score : 0;

      return {
        name: player.name,
        level: player.level,
        score: finalScore,
      };
    });

    io.to(this.lobby.id).emit("gameEnd");
    io.to(this.lobby.id).emit("playerData", playerData);

    for (const player of this.lobby.players) {
      const score =
        this.lobby.gameinside.scores?.find((s) => s.playerId === player.id)
          ?.score || 0;
      const finalScore = anyPlayerHasScore ? score : 0;

      if (finalScore > 0 && player.loggedIn) {
        io.to(player.socketId).emit("xpGained", Math.floor(finalScore / 2));
      }
    }

    this.updateLobby();
  }

  async addXPLoginPlayer(player: Player): Promise<void> {
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
      console.error(
        "Failed to add/update XP:",
        error + " for user " + player.id
      );
    }
  }
}

export default FlagGame;
