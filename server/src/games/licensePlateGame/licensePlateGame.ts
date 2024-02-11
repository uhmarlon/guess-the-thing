import licensePlates from "../../data/licensePlates/licensePlate.json";
import {LicensePlate} from "../../interfaces/interfaces";
import {buildHiddenName} from "../../utils/utils";
import {GameController} from "../gameController";

/**
 * Starts a countdown for a game in a specific room.
 *
 * @param {string} roomName - The name of the room where the game is being played.
 * @param {number} rounds - The maximum number of rounds for the game.
 * @return {Promise<void>} - A promise that resolves when the countdown is finished.
 */
export async function startLicensePlateGame(roomName: string, rounds: number): Promise<void> {

    const roomMeta = GameController.gameMeta.find(room => room.roomName === roomName) || {
        roomName,
        game: "LicensePlate",
        countryString: '',
        round: 1,
        maxRounds: rounds,
    };
    const licensePlate = getRandomLicensePlate();

    // Set the room meta
    roomMeta.countryString = licensePlate.city;
    roomMeta.round = roomMeta.round === roomMeta.maxRounds ? roomMeta.round : roomMeta.round + 1;
    GameController.gameMeta.push(roomMeta);

    // Set the game meta
    GameController.gameSetRound(roomName, roomMeta.round, roomMeta.maxRounds);
    GameController.gameSetRoomString(roomName, buildHiddenName(licensePlate.city));

    GameController.emitGameEventToRoom(roomName, 'Abbreviation', licensePlate.abbreviation);
    GameController.emitGameEventToRoom(roomName, 'City', licensePlate.city);

    if (GameController.checkAndHandleGameEnd(roomMeta, roomName)) return;

    // Start the game countdown
    let counter = 15 + Math.round((licensePlate.city.length / 4) * 0.5);
    const countdownResult = await GameController.startGameCountdown(roomName, counter);

    // If all players have guessed or the countdown has finished, start the final countdown
    if (countdownResult === "stop") {
        // Start the final countdown
        const finalCountdownResult = await GameController.emitFinalCountdown(roomName);

        // If the final countdown has finished and the game has not ended, start a new game
        if (finalCountdownResult === "stop" && roomMeta.round < roomMeta.maxRounds) {
            await startLicensePlateGame(roomName, rounds);
        }
    }
}

/**
 * Retrieves a random license plate from the licensePlates object.
 *
 * @return {LicensePlate} - A random license plate from the licensePlates object.
 */
function getRandomLicensePlate(): LicensePlate {
    return licensePlates.license_plates[
        Math.floor(
            Math.random() * licensePlates.license_plates.length
        )];
}

