import { gameCountdown, gameSetFlag, gameSetRoomString } from "./index";
export async function gameLoops(roomName: string) {
    gameCountdown(roomName, 3);
    gameSetFlag(roomName, "DE"); 
    gameSetRoomString(roomName, "_ _ _");
    await new Promise(resolve => setTimeout(resolve, 1000));
    gameSetFlag(roomName, "GB");
    gameSetRoomString(roomName, "_ _ _ _ ");
    await new Promise(resolve => setTimeout(resolve, 1000));
    gameSetFlag(roomName, "US");
    gameSetRoomString(roomName, "_ _ _ _ _");
}

