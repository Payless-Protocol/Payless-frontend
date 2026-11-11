import type { Metadata } from "next";
import RecoverGate from "@/components/gates/RecoverGate";
import Navbar from "@/components/layout/Navbar";
import { TOKENS } from "@/styles/tokens";

export const metadata: Metadata = {
  title: "Retrieve | Payless Protocol",
  description: "Recover a flagged device using the original hashed credentials.",
};

export default function RetrievePage() {
  return (
    <div className="page-wrap">
      <Navbar />
      <main
        style={{
          flex: 1,
          width: "100%",
          background: TOKENS.blue,
          padding: "145px 24px 90px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 549,
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
                fontSize: 36,
                lineHeight: "45px",
                letterSpacing: 0,
                color: TOKENS.cream,
              }}
            >
              <span
                style={{
                  color: TOKENS.ink,
                  fontFamily: "var(--font-playfair), serif",
                  fontStyle: "italic",
                  fontWeight: 600,
                }}
              >
                Retrieve
              </span>{" "}
              Your Device
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
              Use the 3-word recovery phrase to remove the flag from the registry
            </p>
          </div>

          <RecoverGate />
        </div>
      </main>
    </div>
  );
}
