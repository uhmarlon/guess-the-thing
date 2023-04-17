import { gameCountdown, gameSetFlag, gameSetRoomString, io } from './index';
interface FlagData {
    [key: string]: string;
  }
import flags_de from './flags/de_de.json';
//Unused Import for now, will be used for lang impl.
import flags_en from './flags/en_us.json';
   
  const typedFlags: FlagData = flags_de;

export async function gameLoop(roomName: string, rounds : number): Promise<void> {
    gameSetRoomString(roomName, 'Get ready!');
    await new Promise((resolve) => {
        let outTimer = 3;
        const countdownInterval = setInterval(() => {
          outTimer--;
          let [randomKey, countryString] = getRandomFlag();
          gameSetFlag(roomName, randomKey);
          io.to(roomName).emit('gameCountdown', outTimer);
          if (outTimer === 0) {
            clearInterval(countdownInterval);
            resolve('stop');
          }
        }, 1000);
      });
    gameCountdown(roomName, 15, rounds);
}

export function getRandomFlag(): [string, string] {
    const keys: string[] = Object.keys(typedFlags);
    const randomKey: string = keys[Math.floor(Math.random() * keys.length)];
    const randomFlag: string = typedFlags[randomKey];
    return [randomKey as string, randomFlag as string];
}
