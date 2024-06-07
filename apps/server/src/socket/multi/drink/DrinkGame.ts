import BaseGame from "../BaseGame";
import { Lobby } from "../../../utlis/gametype";
import { io } from "../../../server";
import { Socket } from "socket.io";
import { UserExists } from "../../../api/player/checks/exists";
import cocktailData from "../../../data/cocktail/cocktail.json";

type CocktailData = {
  strDrink: string;
  idDrink: string;
  strDrinkThumb: string;
  strInstructions: string;
};

class DrinkGame extends BaseGame {
  private usedDrinks: Set<string> = new Set();
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
    await this.delay(50);
    this.gameLoop();
  }

  async gameLoop(): Promise<void> {
    for (let i = 0; i < (this.lobby.gameinside?.maxRounds || 5); i++) {
      this.lobby.gameinside.round = i + 1;
      const { maxTime, round, maxRounds } = this.lobby.gameinside;
      const gameInfo = { maxTime, round, maxRounds };
      await this.initializeScores();

      const { correctDrink, options } = await this.getRandomDrink();
      const correctDrinkid = correctDrink.idDrink;
      const inDrinkData = {
        DrinkThumb: correctDrink.strDrinkThumb,
        options,
      };

      if (!this.lobby.gameinside.gameSpecial) {
        this.lobby.gameinside.gameSpecial = [{ i, correctDrinkid }];
      } else {
        this.lobby.gameinside.gameSpecial[i] = { i, correctDrinkid };
      }

      this.updateLobby();

      io.to(this.lobby.id).emit("DrinkData", inDrinkData);
      io.to(this.lobby.id).emit("gameInfo", gameInfo);

      await this.wait(this.lobby.gameinside.maxTime);

      if (!this.lobby.gameinside.scores) {
        return;
      }
      const scoreboard = {
        cocktailName: correctDrink.strDrink,
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
    while (Date.now() - startTime < (maxTime || 30000)) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  async getRandomDrink(): Promise<{
    correctDrink: CocktailData;
    options: { idDrink: string; strDrink: string }[];
  }> {
    const drinks: CocktailData[] = cocktailData as unknown as CocktailData[];
    const availableDrinks = drinks.filter(
      (drink) => !this.usedDrinks.has(drink.idDrink)
    );

    if (availableDrinks.length === 0) {
      console.error("No more drinks available");
      return {
        correctDrink: {
          strDrink: "",
          idDrink: "",
          strDrinkThumb: "",
          strInstructions: "",
        },
        options: [],
      };
    }
    const correctDrink =
      availableDrinks[Math.floor(Math.random() * availableDrinks.length)];
    this.usedDrinks.add(correctDrink.idDrink);

    const otherOptions = drinks
      .filter((drink) => drink.idDrink !== correctDrink.idDrink)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((drink) => ({ idDrink: drink.idDrink, strDrink: drink.strDrink }));

    const options = [
      ...otherOptions,
      { idDrink: correctDrink.idDrink, strDrink: correctDrink.strDrink },
    ].sort(() => 0.5 - Math.random());

    return { correctDrink, options };
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
      const lastDrinkValue =
        lobby.gameinside.round &&
        lobby.gameinside.gameSpecial[lobby.gameinside.round - 1];

      const playerScore = lobby.gameinside.scores.find(
        (score) => score.playerId === player.id
      );
      if (
        data.answer ===
        (lastDrinkValue as { i: number; correctDrinkid: string }).correctDrinkid
      ) {
        if (playerScore && !playerScore.hasPlayed) {
          const score = await DrinkGame.rightAnswer(playerScore, lobby);
          const rdata = {
            score: score,
            drinkValue: (
              lastDrinkValue as { i: number; correctDrinkid: string }
            ).correctDrinkid,
          };
          io.to(socket.id).emit("rightAnswer", rdata);
        }
      } else {
        playerScore?.hasPlayed == true;
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
    const multiplier = 1 + ((lobby.players.length - playersAnswered) / 10) * 2;
    playerScore.score += Math.floor(50 * multiplier);
    playerScore.hasPlayed = true;
    return playerScore.score;
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

export default DrinkGame;
