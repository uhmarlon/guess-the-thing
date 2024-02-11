import {io} from "../app";
import {Player, Room, RoomGameMetadata, RoomMeta} from "../interfaces/interfaces";


/**
 * GameController class for managing game logic and player interactions.
 */
export class GameController {

    gameMeta: RoomGameMetadata[] = [];
    players: Player[] = [];

    /**
     * Returns an instance of the GameController class.
     *
     * @return {GameController} An instance of the GameController class.
     */
    public static getInstance(): GameController {
        return new GameController();
    }


    /**
     * Resets the guesses of players in a room
     * and notifies all the players in the room of the updated player information.
     *
     * @param {string} roomName - The name of the room.
     * @return {void} - This method does not return any value.
     */
    resetGuessesAndNotifyPlayers(roomName: string): void {
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
    startGameCountdown(roomName: string, counter: number): Promise<string> {
        return new Promise((resolve) => {
            const countdownInterval = setInterval(() => {
                const playersInRoom = this.getPlayersInRoom(roomName);
                const allGuessed = playersInRoom.every(
                    (player: { guess: boolean }) => player.guess
                );
                if (allGuessed) {
                    clearInterval(countdownInterval);
                    resolve("stop");
                }
                counter--;
                io.to(roomName).emit("gameCountdown", counter);
                if (counter === 0) {
                    clearInterval(countdownInterval);
                    resolve("stop");
                }
            }, 1000);
        });
    }


    /**
     * Emits a countdown to all connected sockets in a specified room.
     * @param {string} roomName - The name of the room.
     * @return {Promise<string>} - A promise that resolves with the string "stop" when the countdown reaches zero.
     */
    emitFinalCountdown(roomName: string): Promise<string> {
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
     * Sets the license plate for a game in the specified room.
     *
     * @param {string} roomName - The name of the room where the game is being played.
     * @param {string} flagKey - The key representing the license plate.
     * @return {void}
     */
    gameSetLicensePlate(roomName: string, flagKey: string): void {
        const room: Room = io.sockets.adapter.rooms.get(roomName) as unknown as Room;
        if (room) {
            io.to(roomName).emit("gameSetFlag", flagKey);
        }
    }


    /**
     * Sets the room string for a given room.
     *
     * @param {string} roomName - The name of the room.
     * @param {string} roomString - The new room string.
     * @return {void}
     */
    gameSetRoomString(roomName: string, roomString: string): void {
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
    gameSetRound(roomName: string, gameRounds: number, maxRounds: number): void {
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
    checkAndHandleGameEnd(roomMeta: RoomMeta, roomName: string): void {
        if (roomMeta.round === roomMeta.maxRounds) {
            io.to(roomName).emit("gameEnd", this.getPlayersPoints(roomName));
            return;
        }
    }


    /**
     * Retrieves the players currently in a specified room.
     * @param {string} roomName - The name of the room.
     * @return {Player[]} - An array containing the players in the room.
     */
    getPlayersInRoom(roomName: string): Player[] {
        return this.players.filter((player) => player.room === roomName);
    }


    /**
     * Retrieves the points of all players in a specified room.
     *
     * @param {string} roomName - The name of the room to get the players' points from.
     * @return {Player[]} - An array of Player objects sorted in descending order based on their points.
     */
    getPlayersPoints(roomName: string): Player[] {
        const playersInRoom = this.players.filter((player) => player.room === roomName);
        return playersInRoom.sort((a, b) => b.points - a.points);
    }
}