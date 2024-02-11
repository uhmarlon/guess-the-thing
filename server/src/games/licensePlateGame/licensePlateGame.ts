import licensePlates from "../../data/licensePlates/licensePlate.json";
import {LicensePlate} from "../../interfaces/interfaces";
import {buildHiddenName} from "../../utils/utils";
import {GameController} from "../gameController";

/**
 * Starts a countdown for a game in a specific room.
 *
 * @param {string} roomName - The name of the room where the game is being played.
 * @param {number} timer - The initial time for the countdown, in seconds.
 * @param {number} rounds - The maximum number of rounds for the game.
 * @return {Promise<void>} - A promise that resolves when the countdown is finished.
 */
async function gameCountdown(roomName: string, timer: number, rounds: number) {
    const gameController = GameController.getInstance();

    const roomMeta = gameController.gameMeta.find(room => room.roomName === roomName) || {
        roomName,
        game: "license_plate",
        countryString: '',
        round: 1,
        maxRounds: rounds,
    };
    const licensePlate = getRandomLicensePlate();

    // Set the room meta
    roomMeta.countryString = licensePlate.city;
    roomMeta.round = roomMeta.round === roomMeta.maxRounds ? roomMeta.round : roomMeta.round + 1;
    gameController.gameMeta.push(roomMeta);

    // Set the game meta
    gameController.gameSetRound(roomName, roomMeta.round, roomMeta.maxRounds);
    gameController.gameSetRoomString(roomName, buildHiddenName(licensePlate.city));
    gameController.gameSetLicensePlate(roomName, licensePlate.abbreviation);
    gameController.checkAndHandleGameEnd(roomMeta, roomName);

    // Start the game countdown
    let counter = timer + Math.round((licensePlate.city.length / 4) * 0.5);
    await gameController.startGameCountdown(roomName, counter);

    // Start the game
    gameController.resetGuessesAndNotifyPlayers(roomName);
    gameController.gameSetRoomString(roomName, licensePlate.city);

    // Start the game countdown
    await gameController.emitFinalCountdown(roomName);
    await gameCountdown(roomName, 15, rounds);
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