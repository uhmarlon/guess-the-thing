export function generateRandomName(): string {
    const adjectives = ['happy', 'sad', 'angry', 'excited', 'sleepy', 'hungry', 'thirsty'];
    const nouns = ['dog', 'cat', 'bird', 'horse', 'fish', 'lion', 'tiger', 'bear'];
    const random = Math.floor(Math.random() * 105);
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdjective}-${randomNoun}-${random}`;
}

export function makeid(length :number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

export function buildHiddenName(name: string, guess: string = ''): string {
return name.split('').map((char: string, index: number) => {
    if (guess.charAt(index).toLowerCase() === char.toLowerCase()) {
    return name.charAt(index);
    } else if (char === ' ') {
    return 'ㅤ';
    } else if (char === '-') {
    return '-';
    } else {
    return '_';
    }
}).join(' ');
}