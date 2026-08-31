const COOKIE_NAME = "hotelia_session";

export function readSessionCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  try {
    return decodeURIComponent(match.slice(COOKIE_NAME.length + 1));
  } catch {
    return null;
  }
}

export function writeSessionCookie(token: string | null, hours = 24): void {
  if (typeof document === "undefined") return;
  if (!token) {
    document.cookie = `${COOKIE_NAME}=; Max-Age=0; path=/; SameSite=Lax`;
    return;
  }
  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    token
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}
