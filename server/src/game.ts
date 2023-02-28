import { gameCountdown, gameSetFlag, gameSetRoomString } from './index';
interface FlagData {
    [key: string]: string;
  }
  import flags from './flags.json';
  
  const typedFlags: FlagData = flags;

export async function gameLoops(roomName: string): Promise<void> {
    gameCountdown(roomName, 15);
}

export function getRandomFlag(): [string, string] {
    const keys: string[] = Object.keys(typedFlags);
    const randomKey: string = keys[Math.floor(Math.random() * keys.length)];
    const randomFlag: string = typedFlags[randomKey];
    return [randomKey as string, randomFlag as string];
}
