"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { hasPrivySessionHint } from "@/lib/privySessionHint";
import { useWalletProviderPresent } from "@/providers/WalletProviderPresence";
import { TOKENS } from "@/styles/tokens";

function UserIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ArrowRightIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function SignedOutButtons({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <button
        onClick={onSignIn}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: 122,
          height: 45,
          justifyContent: "center",
          background: "transparent",
          border: `2px solid ${TOKENS.cream}`,
          borderRadius: 16,
          color: TOKENS.cream,
          fontFamily: "var(--font-poppins), sans-serif",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
          transition: "border-color 0.2s ease, background 0.2s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = TOKENS.white;
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = TOKENS.cream;
          e.currentTarget.style.background = "transparent";
        }}
      >
        Sign Up <ArrowRightIcon size={15} />
      </button>
      <button
        onClick={onSignIn}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: 139,
          height: 45,
          justifyContent: "center",
          background: TOKENS.ink,
          border: "1px solid transparent",
          borderRadius: 16,
          color: TOKENS.cream,
          fontFamily: "var(--font-poppins), sans-serif",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          transition: "background 0.2s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "#2b2d2b")}
        onMouseOut={(e) => (e.currentTarget.style.background = TOKENS.ink)}
      >
        Login Now <UserIcon size={15} />
      </button>
    </div>
  );
}

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout?: number }
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function AuthEntry() {
  const providerPresent = useWalletProviderPresent();
  const [mounted, setMounted] = useState(false);
  const [autoOpen, setAutoOpen] = useState(false);

  const requestSignIn = useCallback(() => {
    setAutoOpen(true);
    setMounted(true);
  }, []);

  const AuthIsland = useMemo(
    () =>
      dynamic(() => import("./AuthIsland"), {
        ssr: false,
        loading: () => <SignedOutButtons onSignIn={requestSignIn} />,
      }),
    [requestSignIn]
  );

  useEffect(() => {
    if (mounted) {
      return;
    }

    if (providerPresent) {
      setMounted(true);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (Array.from(params.keys()).some((key) => key.startsWith("privy_oauth_"))) {
      setMounted(true);
      return;
    }

    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const check = () => {
      if (cancelled) {
        return;
      }

      if (hasPrivySessionHint()) {
        setMounted(true);
      }
    };

    const idleWindow = window as IdleWindow;

    if (typeof idleWindow.requestIdleCallback === "function") {
      idleId = idleWindow.requestIdleCallback(check, { timeout: 2000 });
      timeoutId = setTimeout(check, 2500);
    } else {
      timeoutId = setTimeout(check, 1000);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof idleWindow.cancelIdleCallback === "function") {
        idleWindow.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [mounted, providerPresent]);

  return (
    <div
      style={{
        minWidth: 271,
        minHeight: 45,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      {mounted ? (
        <AuthIsland autoOpen={autoOpen} />
      ) : (
        <SignedOutButtons onSignIn={requestSignIn} />
      )}
    </div>
  );
}
