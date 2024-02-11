import {io} from "../app";
import {Player, Room, RoomGameMetadata, RoomMeta} from "../interfaces/interfaces";


/**
 * GameController class for managing game logic and player interactions.
 */
export class GameController {
    public static gameMeta: RoomGameMetadata[] = [];
    public static players: Player[] = [];

    /**
     * Resets the guesses of players in a room
     * and notifies all the players in the room of the updated player information.
     *
     * @param {string} roomName - The name of the room.
     * @return {void} - This method does not return any value.
     */
    public static resetGuessesAndNotifyPlayers(roomName: string): void {
        const playersInRoom = this.getPlayersInRoom(roomName);
        playersInRoom.forEach((player: { guess: boolean }) => {
            player.guess = false;
        });
        io.to(roomName).emit("update-players", playersInRoom);
    }

    /**
     * Start the game countdown timer.
     *
     * @param {string} roomName - The name of the room.
     * @param {number} counter - The initial counter value.
     * @return {Promise<string>} - A promise that resolves with "stop" when the countdown is stopped.
     */
    public static startGameCountdown(roomName: string, counter: number): Promise<string> {
        return new Promise((resolve) => {
            const countdownInterval = setInterval(() => {
                const playersInRoom = this.getPlayersInRoom(roomName);
                const allGuessed = playersInRoom.every(
                    (player: { guess: boolean }) => player.guess
                );

                if (playersInRoom.length === 0) {
                    clearInterval(countdownInterval);
                    return resolve("stop");
                }
                if (allGuessed) {
                    clearInterval(countdownInterval);
                    return resolve("stop");
                }
                counter--;
                io.to(roomName).emit("gameCountdown", counter);
                if (counter === 0) {
                    clearInterval(countdownInterval);
                    return resolve("stop");
                }
            }, 1000); // Ensure this is 1000 for a countdown every second
        });
    }


    /**
     * Emits a countdown to all connected sockets in a specified room.
     * @param {string} roomName - The name of the room.
     * @return {Promise<string>} - A promise that resolves with the string "stop" when the countdown reaches zero.
     */
    public static emitFinalCountdown(roomName: string): Promise<string> {
        return new Promise((resolve) => {
            let outTimer = 5;
            const countdownInterval = setInterval(() => {
                outTimer--;
                io.to(roomName).emit("gameCountdown", outTimer);
                if (outTimer === 0) {
                    clearInterval(countdownInterval);
                    resolve("stop");
                }
            }, 1000);
        });
    }


    /**
     * Emits a game event to the specified room.
     * @param {string} roomName - The name of the room to emit the event to.
     * @param {string} gameName - The name of the game corresponding to the game event.
     * @param {string} key - The key associated with the game event.
     * @return {void}
     */
    public static emitGameEventToRoom(roomName: string, gameName: string, key: string): void {
        const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
        if (room) {
            io.to(roomName).emit("gameSet" + gameName, key);
        }
    }


    /**
     * Sets the room string for a given room.
     *
     * @param {string} roomName - The name of the room.
     * @param {string} roomString - The new room string.
     * @return {void}
     */
    public static gameSetRoomString(roomName: string, roomString: string): void {
        const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
        if (room) {
            io.to(roomName).emit("gameSetroomString", roomString);
        }
    }


    /**
     * Set the round of the game for a specific room.
     *
     * @param {string} roomName - The name of the room.
     * @param {number} gameRounds - The current round of the game.
     * @param {number} maxRounds - The maximum number of rounds for the game
     * @return {void} - This method does not return any value.
     */
    public static gameSetRound(roomName: string, gameRounds: number, maxRounds: number): void {
        if (!io.sockets.adapter.rooms.get(roomName)) return;
        io.to(roomName).emit("gameRounds", gameRounds, maxRounds);
    }


    /**
     * Checks if the game has ended and handles the game end logic.
     *
     * @param {RoomMeta} roomMeta - The metadata of the room.
     * @param {string} roomName - The name of the room.
     * @return {void}
     */
    public static checkAndHandleGameEnd(roomMeta: RoomMeta, roomName: string): boolean {
        if (roomMeta.round === roomMeta.maxRounds) {
            io.to(roomName).emit("gameEnd", this.getPlayersPoints(roomName));
            return true;
        }
        return false;
    }


    /**
     * Retrieves the players currently in a specified room.
     * @param {string} roomName - The name of the room.
     * @return {Player[]} - An array containing the players in the room.
     */
    public static getPlayersInRoom(roomName: string): Player[] {
        return this.players.filter((player) => player.room === roomName);
    }


    /**
     * Retrieves the points of all players in a specified room.
     *
     * @param {string} roomName - The name of the room to get the players' points from.
     * @return {Player[]} - An array of Player objects sorted in descending order based on their points.
     */
    public static getPlayersPoints(roomName: string): Player[] {
        const playersInRoom = this.players.filter((player) => player.room === roomName);
        return playersInRoom.sort((a, b) => b.points - a.points);
    }
}