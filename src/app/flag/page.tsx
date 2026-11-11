import type { Metadata } from "next";
import FlagGate from "@/components/gates/FlagGate";
import Navbar from "@/components/layout/Navbar";
import { TOKENS } from "@/styles/tokens";

export const metadata: Metadata = {
  title: "Flag | Payless Protocol",
  description: "Flag a lost or stolen device on-chain using a 3-word secret phrase.",
};

export default function FlagPage() {
  return (
    <div className="page-wrap">
      <Navbar />
      <main
        style={{
          flex: 1,
          width: "100%",
          background: TOKENS.blue,
          padding: "145px 24px 50px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 702,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 25,
              marginBottom: 25,
            }}
          >
            <h1
              className="display-heading"
              style={{
                width: "100%",
                margin: 0,
                textAlign: "center",
                fontFamily: "var(--font-bricolage), sans-serif",
                fontWeight: 600,
                fontVariationSettings: "'wght' 600, 'wdth' 100, 'opsz' 14",
                fontSize: "clamp(28px, 2.5vw, 36px)",
                lineHeight: 1.25,
                letterSpacing: 0,
                color: TOKENS.cream,
              }}
            >
              Report{" "}
              <span
                style={{
                  color: TOKENS.ink,
                  fontFamily: "var(--font-playfair), serif",
                  fontStyle: "italic",
                  fontWeight: 600,
                }}
              >
                lost or stolen
              </span>{" "}
              Device
            </h1>

            <p
              style={{
                width: "100%",
                margin: 0,
                textAlign: "center",
                color: "rgba(255,255,255,0.75)",
                fontFamily: "var(--font-poppins), sans-serif",
                fontWeight: 500,
                fontSize: 16,
                lineHeight: "24px",
                letterSpacing: 0,
              }}
            >
              Write the IMEI hash to the registry from a connected wallet so others can see
              the report.
            </p>
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: 463,
              marginBottom: 25,
              background: TOKENS.danger,
              borderRadius: 20,
              paddingLeft: 5,
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: 10,
                background: TOKENS.cream,
                borderRadius: 20,
              }}
            >
              <span style={{ color: TOKENS.danger, flex: "0 0 auto" }}>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
              </span>
              <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                <div
                  style={{
                    color: TOKENS.danger,
                    fontFamily: "var(--font-poppins), sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: "18px",
                  }}
                >
                  Important Notice
                </div>
                <div
                  style={{
                    marginTop: 5,
                    color: TOKENS.danger,
                    fontFamily: "var(--font-poppins), sans-serif",
                    fontSize: 12,
                    fontWeight: 500,
                    lineHeight: "18px",
                  }}
                >
                  This action writes to the registry and cannot be undone. Make sure the
                  IMEI and secret phrase are correct.
                </div>
              </div>
            </div>
          </div>

          <FlagGate />

          <div
            style={{
              width: "100%",
              maxWidth: 608,
              marginTop: 25,
              textAlign: "center",
              color: "rgba(255,255,255,0.75)",
              fontFamily: "var(--font-poppins), sans-serif",
              fontWeight: 500,
              fontSize: 16,
              lineHeight: "24px",
              letterSpacing: 0,
            }}
          >
            Built on <span style={{ color: TOKENS.ink }}>Base</span>.
          </div>
        </div>
      </main>
    </div>
  );
}
