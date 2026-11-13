const STORAGE_SESSION_KEY_PATTERN = /^privy:(?:.+:)?(?:token|refresh_token|id-token)$/;
const COOKIE_SESSION_KEY_PATTERN = /^privy-(?:.+?-)?(?:token|refresh-token|id-token|session)$/;

function hasCookieSessionHint(): boolean {
  try {
    return document.cookie.split(";").some((entry) => {
      const name = entry.split("=")[0]?.trim();
      return name ? COOKIE_SESSION_KEY_PATTERN.test(name) : false;
    });
  } catch {
    return false;
  }
}

export function hasPrivySessionHint(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key && STORAGE_SESSION_KEY_PATTERN.test(key)) {
        return true;
      }
    }
  } catch {
    return hasCookieSessionHint();
  }

  return hasCookieSessionHint();
}
