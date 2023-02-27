export function generateRandomName(): string {
    const adjectives = ['happy', 'sad', 'angry', 'excited', 'sleepy', 'hungry', 'thirsty'];
    const nouns = ['dog', 'cat', 'bird', 'horse', 'fish', 'lion', 'tiger', 'bear'];
    const random = Math.floor(Math.random() * 105);
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdjective}-${randomNoun}-${random}`;
}