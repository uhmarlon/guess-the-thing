import BaseGame from "../BaseGame";
import { Lobby } from "../../../utlis/gametype";
import { io } from "../../../server";
import { Socket } from "socket.io";
import * as flags_en from "../../../data/flags/en_us.json";

type FlagData = {
  [key: string]: string;
};

class FlagGame extends BaseGame {
  private usedFlags: Set<string> = new Set();
  constructor(lobby: Lobby) {
    super(lobby);
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

      if (i === (this.lobby.gameinside?.maxRounds ?? 0) - 1) {
        this.updateLobby();
        await this.endGame();
        return;
      }

      io.to(this.lobby.id).emit("scoreBoard", scoreboard);
      await this.wait(5);

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
          await FlagGame.rightAnswer(playerScore, lobby);
          io.to(socket.id).emit(
            "rightAnswer",
            (lastFlagValue as FlagData).flagValue
          );
        }
      } else {
        console.log(player.id + " has answered wrong with " + data.answer);
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
  ): Promise<void> {
    if (!lobby.gameinside.scores) {
      return;
    }
    const playersAnswered = lobby.gameinside.scores.filter(
      (score) => score.hasPlayed
    ).length;
    const multiplier = 1 + (lobby.players.length - playersAnswered) / 10;
    playerScore.score += Math.floor(50 * multiplier);
    playerScore.hasPlayed = true;
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
    const flagKeys = Object.keys(flags_en).filter(
      (key) => !this.usedFlags.has(key)
    );

    if (flagKeys.length === 0) {
      console.error("No more flags available");
      return {};
    }
    const newFlagKey = flagKeys[Math.floor(Math.random() * flagKeys.length)];
    this.usedFlags.add(newFlagKey);
    return { [newFlagKey]: flags_en[newFlagKey as keyof typeof flags_en] };
  }

  async endGame(): Promise<void> {
    this.lobby.gameState = "postGame";
    io.to(this.lobby.id).emit("gameEnd");
    console.log("Ending Example Game for lobby:", this.lobby);
    this.updateLobby();
  }
}

export default FlagGame;
