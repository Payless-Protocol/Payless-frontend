"use client";

import { useEffect } from "react";
import { TOKENS } from "@/styles/tokens";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100dvh",
          background: TOKENS.blue,
          color: "#ffffff",
          fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
        }}
      >
        <div style={{ textAlign: "center", padding: 24 }}>
          <h1
            style={{
              fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: 32,
              margin: "0 0 16px",
              color: TOKENS.cream,
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
              fontSize: 15,
              color: "rgba(255,255,255,0.85)",
              margin: "0 0 24px",
            }}
          >
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={() => reset()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 24px",
              borderRadius: 999,
              border: `1px solid ${TOKENS.cream}`,
              color: TOKENS.cream,
              fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              cursor: "pointer",
              background: "transparent",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
