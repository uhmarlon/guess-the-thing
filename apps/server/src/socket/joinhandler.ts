import { Socket } from "socket.io";
import GameDataManager from "./gameDataManager";
import { Player } from "../utlis/gametype";

class JoinHandler {
  static bind(socket: Socket): void {
    const manager = GameDataManager.getInstance();

    socket.on(
      "join",
      (
        lobbyId: string,
        gameType: string,
        gameFlag: string,
        playerId: string
      ) => {
        if (!playerId) {
          console.log("No player ID provided, cannot join lobby.");
          return;
        }

        let lobby = manager.getLobbyById(lobbyId);
        if (!lobby) {
          lobby = {
            id: lobbyId,
            hostIdplayer: playerId,
            players: [],
            gameMode: gameType,
            gameinside: { gameId: "game_" + lobbyId, scores: [] },
            gameState: "waiting",
          };
          manager.addLobby(lobby);
        }

        const authToken = socket.handshake.auth.token;
        const existingPlayer = lobby.players.find(
          (p) => p.id === playerId && p.authtoken === authToken
        );
        if (existingPlayer) {
          existingPlayer.socketId = socket.id;
          clearTimeout(existingPlayer.inactivityTimeout);
          existingPlayer.inactivityTimeout = setTimeout(() => {
            manager.removePlayerFromLobby(lobbyId, existingPlayer.id);
            console.log(
              `Player ${existingPlayer.id} removed due to inactivity.`
            );
          }, 120000); // 2 minutes
          console.log(`Player ${playerId} reconnected to lobby ${lobbyId}`);
        } else {
          const newPlayer: Player = {
            id: playerId,
            name: "",
            points: 0,
            level: 1,
            loggedIn: true,
            authtoken: authToken,
            socketId: socket.id,
            isHost: lobby.players.length === 0,
            inactivityTimeout: setTimeout(() => {
              manager.removePlayerFromLobby(lobbyId, playerId);
              console.log(`Player ${playerId} removed due to inactivity.`);
            }, 120000),
          };
          manager.addPlayerToLobby(lobbyId, newPlayer);
          socket.join(lobbyId);
          // emit to all players in the lobby all players in the lobby
          //socket.to(lobbyId).emit("players", lobby.players);
          console.log(
            `Emitting players data for lobby ${lobbyId}:`,
            lobby.players
          );
          console.log(`Player ${playerId} joined lobby ${lobbyId}`);
        }
      }
    );
  }

  static disconnect(socket: Socket): void {
    const manager = GameDataManager.getInstance();
    manager.getLobbies().forEach((lobby) => {
      lobby.players.forEach((player) => {
        if (player.socketId === socket.id) {
          clearTimeout(player.inactivityTimeout);
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
