"use client";

import type { CSSProperties } from "react";
import { TOKENS } from "@/styles/tokens";

const panelStyle: CSSProperties = {
  width: 504,
  maxWidth: "calc(100vw - 40px)",
  background: TOKENS.cream,
  borderRadius: 25,
  padding: 30,
  display: "flex",
  flexDirection: "column",
};

const messageFieldStyle: CSSProperties = {
  width: "100%",
  height: 56,
  padding: 14,
  borderRadius: 20,
  border: "2px solid #000000",
  background: "transparent",
  color: TOKENS.inkText,
  fontFamily: "var(--font-poppins), sans-serif",
  fontSize: 16,
  fontWeight: 500,
  lineHeight: "24px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "clip",
};

export function SigningOverlay({
  message,
  onSign,
  signing,
}: {
  message: string;
  onSign: () => void;
  signing: boolean;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sign message"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(75px)",
        WebkitBackdropFilter: "blur(75px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div style={panelStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 24,
          }}
        >
          <span
            style={{
              color: TOKENS.inkText,
              fontFamily: "var(--font-poppins), sans-serif",
              fontSize: 16,
              fontWeight: 600,
              lineHeight: "24px",
            }}
          >
            Sign message
          </span>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flex: "0 0 auto" }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: "50%",
                  background: TOKENS.ink,
                  display: "inline-block",
                }}
              />
            ))}
          </div>
        </div>

        <p
          style={{
            margin: "30px 0 0",
            color: TOKENS.inkText,
            fontFamily: "var(--font-poppins), sans-serif",
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "24px",
          }}
        >
          Signing this message will not cost you any fees.
        </p>

        <div style={{ ...messageFieldStyle, marginTop: 30 }} className="overflow-anywhere">
          {message}
        </div>

        <button
          type="button"
          onClick={onSign}
          disabled={signing}
          style={{
            width: "100%",
            height: 52,
            marginTop: 30,
            borderRadius: 16,
            border: "none",
            background: TOKENS.ink,
            color: TOKENS.cream,
            fontFamily: "var(--font-poppins), sans-serif",
            fontSize: 16,
            fontWeight: 600,
            lineHeight: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: signing ? "not-allowed" : "pointer",
            opacity: signing ? 0.7 : 1,
          }}
        >
          {signing ? "Processing..." : "Sign and continue"}
        </button>
      </div>
    </div>
  );
}

export default SigningOverlay;
