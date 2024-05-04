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
              hostIdplayer: playerId,
              players: [],
              gameMode: gamemode,
              gameinside: { gameId: "game_" + lobbyId, scores: [] },
              gameState: "waiting",
            };
            manager.addLobby(lobby);
          }
          let hasLoggedin: boolean = false;
          if (!playerId.startsWith("guest-")) {
            console.log(`Checking if user ${playerId} exists`);
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
            socket.join(lobbyId);
            // TODO: SECURITY: Emitting not all information about the player
            socket.to(lobbyId).emit("player", lobby.players);
          }
        }
      }
    );
  }

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
