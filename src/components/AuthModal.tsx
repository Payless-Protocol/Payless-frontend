"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { TOKENS } from "@/styles/tokens";

function UserIcon({ size = 20 }: { size?: number }) {
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

function ArrowRightIcon({ size = 20 }: { size?: number }) {
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

function SignOutIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function AuthModal() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { address } = useAccount();
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (ready) {
      const timer = setTimeout(() => setSettled(true), 300);
      return () => clearTimeout(timer);
    }
  }, [ready]);

  const shortenedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`.toUpperCase();
  }, [address]);

  if (!ready || !settled) {
    return (
      <div
        style={{
          padding: "10px 16px",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 999,
          color: "rgba(255,255,255,0.7)",
          fontSize: 12,
        }}
      >
        Loading...
      </div>
    );
  }

  if (authenticated && address) {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span
          style={{
            padding: "9px 14px",
            background: TOKENS.ink,
            borderRadius: 999,
            fontFamily: "var(--font-poppins), sans-serif",
            fontSize: 13,
            color: TOKENS.cream,
            fontWeight: 600,
          }}
        >
          {shortenedAddress}
        </span>
        <button
          onClick={() => logout()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 16px",
            background: "transparent",
            border: `1px solid ${TOKENS.cream}`,
            borderRadius: 999,
            color: TOKENS.cream,
            fontFamily: "var(--font-poppins), sans-serif",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sign Out <SignOutIcon size={14} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 25, alignItems: "center" }}>
      <button
        onClick={() => login()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: 120,
          height: 45,
          justifyContent: "center",
          background: "transparent",
          border: `2px solid ${TOKENS.cream}`,
          borderRadius: 16,
          color: TOKENS.cream,
          fontFamily: "var(--font-poppins), sans-serif",
          fontSize: 14,
          fontWeight: 600,
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
        Sign Up <ArrowRightIcon />
      </button>
      <button
        onClick={() => login()}
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
        Login Now <UserIcon />
      </button>
    </div>
  );
}
