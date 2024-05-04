export function getOrCreateGuestToken(key: string): string {
  const currentToken = localStorage.getItem(key);
  const isGuestToken = currentToken?.startsWith("guest-");

  if (currentToken === null || !isGuestToken) {
    const guestToken = `guest-${Math.random().toString(36).substring(2)}`;
    localStorage.setItem(key, guestToken);
    return guestToken;
  }

  return currentToken;
}
