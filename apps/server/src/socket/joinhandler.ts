import { Socket } from "socket.io";
import GameDataManager from "./gameDataManager";
import { Player } from "../utlis/gametype";
import { UserExists } from "../api/player/checks/exists";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";

class JoinHandler {
  static async bind(socket: Socket): Promise<void> {
    const manager = GameDataManager.getInstance();

    socket.on(
      "join",
      async (
        lobbyId: string,
        gameVariant: string,
        gamemode: string,
        playerId: string
      ) => {
        if (!playerId) {
          socket.emit("error", "Player ID is required to join a lobby.");
          return;
        }
        if (gameVariant === "multi") {
          let lobby = manager.getLobbyById(lobbyId);
          if (!lobby) {
            lobby = {
              id: lobbyId,
              gamekey: manager.generateGameCode(),
              hostIdplayer: playerId,
              players: [],
              gameMode: gamemode,
              gameinside: { gameId: "game_" + lobbyId, scores: [] },
              gameState: "waiting",
            };
            manager.addLobby(lobby);
          }
          if (lobby.gameState === "inGame" || lobby.gameState === "postGame") {
            // TODO: Handel this case
            return;
          }
          let hasLoggedin: boolean = false;
          if (!playerId.startsWith("guest-")) {
            const userExists = new UserExists();
            const exists = await userExists.checkUserExists(playerId);
            console.log(`User ${playerId} exists: ${exists}`);
            if (exists) {
              hasLoggedin = true;
            }
          }

          const existingPlayer = lobby.players.find((p) => p.id === playerId);

          if (existingPlayer) {
            existingPlayer.socketId = socket.id;
            console.log(`Player ${playerId} reconnected to lobby ${lobbyId}`);
          } else {
            let username: string;
            if (hasLoggedin) {
              const getname = await db
                .select()
                .from(users)
                .where(eq(users.id, playerId));
              username = getname[0].name as string;
            } else {
              const randomNames = ["Stranger", "StrangerDanger", "Newbie"];
              username =
                randomNames[Math.floor(Math.random() * randomNames.length)];
            }

            const newPlayer: Player = {
              id: playerId,
              name: username,
              points: 0,
              level: 1,
              loggedIn: hasLoggedin,
              socketId: socket.id,
              isHost: lobby.players.length === 0,
            };
            manager.addPlayerToLobby(lobbyId, newPlayer);
            const gameLobbyClientInfo = {
              id: lobby.id,
              gamekey: lobby.gamekey,
              playersinfo: [
                ...lobby.players.map((player) => {
                  return {
                    id: player.id,
                    name: player.name,
                    points: player.points,
                    level: player.level,
                    loggedIn: player.loggedIn,
                    isHost: player.isHost,
                  };
                }),
              ],
              gameState: lobby.gameState,
            };
            socket.join(lobbyId);
            socket.emit("gamekey", lobby.gamekey);
            // TODO: SECURITY: Emitting not all information about the player
            socket.emit("player", gameLobbyClientInfo);
            socket.to(lobbyId).emit("player", gameLobbyClientInfo);
            console.log(gameLobbyClientInfo);
          }
        }
      }
    );
  }

  // TODO: Implement this method or clean up after time
  static disconnect(socket: Socket): void {
    const manager = GameDataManager.getInstance();
    manager.getLobbies().forEach((lobby) => {
      lobby.players.forEach((player) => {
        if (player.socketId === socket.id) {
          manager.removePlayerFromLobby(lobby.id, player.id);
          if (lobby.players.length === 0) {
            manager.removeLobby(lobby.id);
          }
          console.log(
            `Player ${player.id} disconnected and was removed from lobby ${lobby.id}`
          );
        }
      });
    });
  }
}

export default JoinHandler;
