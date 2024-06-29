import BaseGame from "../BaseGame";
import { Lobby } from "../../../utlis/gametype";
import { io } from "../../../server";
import { Socket } from "socket.io";
import { UserExists } from "../../../api/player/checks/exists";
import { db } from "../../../db";
import { preisguess } from "../../../db/schema";
import { sql } from "drizzle-orm";

type PriceData = {
  id: number;
  title: string;
  price: string;
  image: string | null;
  createdAt: Date | null;
};

class PriceGame extends BaseGame {
  private usedPrice: Set<number> = new Set();
  private language: "en";

  constructor(lobby: Lobby, language: "en") {
    super(lobby);
    this.language = language;
  }

  async startGame(): Promise<void> {
    io.to(this.lobby.id).emit("gameCounter");
    await this.delay(3000);
    this.lobby.gameState = "inGame";
    this.updateLobby();
    await this.delay(2000);
    io.to(this.lobby.id).emit("gameScreen");
    await this.delay(60);
    this.gameLoop();
  }

  async gameLoop(): Promise<void> {
    const leaderboardInt = {
      ItemPrice: 0,
      player: this.lobby.players.map((player) => ({
        username: player.name,
        level: player.level,
        score: 0,
        priceguess: "**",
        differanz: "0",
      })),
    };
    io.to(this.lobby.id).emit("initalleaderboard", leaderboardInt);
    const maxPlayer = this.lobby.players.length;
    io.to(this.lobby.id).emit("guessBoard", {
      guessPlayer: 0,
      maxPlayer,
    });

    for (let i = 0; i < (this.lobby.gameinside?.maxRounds || 5); i++) {
      this.lobby.gameinside.round = i + 1;
      const { maxTime, round, maxRounds } = this.lobby.gameinside;
      const gameInfo = { maxTime, round, maxRounds };
      await this.initializeScores();

      const randomItem: PriceData = await this.getRandomItem();
      const correctItem = randomItem;
      const inPriceData = {
        Image: randomItem.image,
        title: randomItem.title,
      };

      if (!this.lobby.gameinside.gameSpecial) {
        this.lobby.gameinside.gameSpecial = [{ i, correctItem }];
      } else {
        this.lobby.gameinside.gameSpecial[i] = { i, correctItem };
      }

      this.updateLobby();

      io.to(this.lobby.id).emit("EbayData", inPriceData);
      io.to(this.lobby.id).emit("gameInfo", gameInfo);

      await this.wait(this.lobby.gameinside.maxTime);
      if (!this.lobby.gameinside.scores) {
        return;
      }
      await this.calculateScores(randomItem.price);

      const scoreboard = {
        ItemPrice: randomItem.price,
        player: this.lobby.players
          .map((player) => {
            const playerScore = this.lobby.gameinside.scores?.find(
              (s) => s.playerId === player.id
            );
            const gameScoreSpecial = playerScore?.gameScoreSpecial?.[0] as {
              priceguess: number;
              differanz: number;
            };

            return {
              username: player.name,
              level: player.level,
              score: playerScore?.score ?? 0,
              priceguess: gameScoreSpecial
                ? gameScoreSpecial.priceguess.toString()
                : "**",
              differanz: gameScoreSpecial
                ? gameScoreSpecial.differanz.toString()
                : "**",
            };
          })
          .sort((a, b) => b.score - a.score),
      };

      io.to(this.lobby.id).emit("scoreBoard", scoreboard);
      await this.delay(10000);

      for (const playerScore of this.lobby.gameinside.scores) {
        playerScore.gameScoreSpecial = [{ priceguess: 0, differanz: 0 }];
        playerScore.hasPlayed = false;
      }

      if (i === (this.lobby.gameinside?.maxRounds ?? 0) - 1) {
        this.updateLobby();
        await this.endGame();
        return;
      }
      this.updateLobby();
    }
  }

  async calculateScores(correctPrice: string): Promise<void> {
    if (!this.lobby.gameinside.scores) {
      return;
    }
    const correctPriceFloat = parseFloat(correctPrice);

    for (const player of this.lobby.players) {
      const playerScore = this.lobby.gameinside.scores.find(
        (s) => s.playerId === player.id
      );

      if (!playerScore) {
        continue;
      }

      let gameScoreSpecial: { priceguess: number; differanz: number | string } =
        {
          priceguess: 0,
          differanz: 0,
        };

      if (
        playerScore.gameScoreSpecial &&
        playerScore.gameScoreSpecial.length > 0
      ) {
        gameScoreSpecial = playerScore.gameScoreSpecial[0] as {
          priceguess: number;
          differanz: number | string;
        };
      }

      const priceguess = gameScoreSpecial.priceguess;
      if (playerScore.hasPlayed && priceguess !== 0) {
        const differanz = correctPriceFloat - priceguess;
        const absDifferanz = Math.abs(differanz);
        const score = Math.floor(Math.max(0, 100 - absDifferanz));

        playerScore.score += score;
        playerScore.gameScoreSpecial = [
          {
            priceguess,
            differanz: (differanz >= 0 ? "+" : "") + differanz.toFixed(2),
          },
        ];
      }
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
      await this.delay(1000);
    }
  }

  async getRandomItem(): Promise<PriceData> {
    console.time("getRandomItem");
    try {
      const item = await this.fetchRandomItem();
      console.timeEnd("getRandomItem");
      return item;
    } catch (error) {
      console.error("Failed to get random item from DB:", error);
      throw error;
    }
  }

  private async fetchRandomItem(): Promise<PriceData> {
    let retries = 0;
    const maxRetries = 10;

    while (retries < maxRetries) {
      const data = await db
        .select()
        .from(preisguess)
        .where(sql`id >= FLOOR(RAND() * (SELECT MAX(id) FROM ${preisguess}))`)
        .limit(1)
        .execute();
      if (data.length === 0) {
        retries++;
        continue;
      }
      const item = data[0];
      if (!this.usedPrice.has(item.id)) {
        this.usedPrice.add(item.id);
        return item;
      }

      retries++;
    }
    throw new Error("Exceeded maximum retries to fetch a unique item.");
  }

  static async answerHandel(
    socket: Socket,
    data: { lobbyId: string; answer: number },
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
      const answer = data.answer;
      const differanz = 0;
      const playerScore = lobby.gameinside.scores.find(
        (s) => s.playerId === player.id
      );
      if (playerScore) {
        playerScore.hasPlayed = true;
        playerScore.gameScoreSpecial = [{ priceguess: answer, differanz }];
      }
      const playersAnswered = lobby.gameinside.scores.filter(
        (score) => score.hasPlayed
      ).length;
      const maxPlayer = lobby.players.length;
      io.to(lobby.id).emit("guessBoard", {
        guessPlayer: playersAnswered,
        maxPlayer,
      });
    } catch (error) {
      console.error("Failed to handle answer:", error);
    }
  }

  async endGame(): Promise<void> {
    this.lobby.gameState = "postGame";
    for (const player of this.lobby.players) {
      const score =
        this.lobby.gameinside.scores?.find((s) => s.playerId === player.id)
          ?.score || 0;
      if (score > 0 && player.loggedIn) {
        const userExists = new UserExists();
        if (await userExists.checkUserExists(player.id)) {
          await this.addXPLoginPlayer(player);
          await this.addStatistics(player, 2, this.language);
        }
      }
    }

    const playerData = this.lobby.players.map((player) => {
      const score =
        this.lobby.gameinside.scores?.find((s) => s.playerId === player.id)
          ?.score || 0;
      return {
        name: player.name,
        level: player.level,
        score: score,
      };
    });
    io.to(this.lobby.id).emit("gameEnd");
    await this.delay(60);
    io.to(this.lobby.id).emit("playerData", playerData);
    for (const player of this.lobby.players) {
      const score =
        this.lobby.gameinside.scores?.find((s) => s.playerId === player.id)
          ?.score || 0;
      if (score > 0 && player.loggedIn) {
        io.to(player.socketId).emit("xpGained", Math.floor(score / 2));
      }
    }

    this.updateLobby();
  }
}

export default PriceGame;
