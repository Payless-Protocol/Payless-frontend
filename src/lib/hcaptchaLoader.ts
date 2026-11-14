const HCAPTCHA_SCRIPT_URL =
  "https://js.hcaptcha.com/1/api.js?onload=hCaptchaOnLoad&render=explicit&uj=false";
const LOAD_TIMEOUT_MS = 5000;
const POLL_INTERVAL_MS = 100;

declare global {
  interface Window {
    hcaptcha?: unknown;
    hCaptchaOnLoad?: unknown;
  }
}

let loadPromise: Promise<void> | null = null;

function noop() {}

function hasHcaptchaGlobal(): boolean {
  return typeof window !== "undefined" && typeof window.hcaptcha !== "undefined";
}

function clearOwnCallback(): void {
  if (window.hCaptchaOnLoad === noop) {
    delete window.hCaptchaOnLoad;
  }
}

function startLoading(): Promise<void> {
  return new Promise((resolve) => {
    const startedAt = Date.now();

    const timer = setInterval(() => {
      if (hasHcaptchaGlobal()) {
        clearInterval(timer);
        clearOwnCallback();
        resolve();
        return;
      }
      if (Date.now() - startedAt >= LOAD_TIMEOUT_MS) {
        clearInterval(timer);
        clearOwnCallback();
        console.warn(
          "[PaylessAuth] hcaptcha script did not load within 5000ms; continuing without it"
        );
        resolve();
        return;
      }
    }, POLL_INTERVAL_MS);

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${HCAPTCHA_SCRIPT_URL}"]`
    );
    if (existing) {
      return;
    }

    if (typeof window.hCaptchaOnLoad !== "function") {
      window.hCaptchaOnLoad = noop;
    }

    const script = document.createElement("script");
    script.src = HCAPTCHA_SCRIPT_URL;
    script.async = true;
    document.head.appendChild(script);
  });
}

export function ensureHcaptchaReady(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  if (hasHcaptchaGlobal()) {
    return Promise.resolve();
  }
  if (!loadPromise) {
    loadPromise = startLoading();
  }
  return loadPromise;
}
