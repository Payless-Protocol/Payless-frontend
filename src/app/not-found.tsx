import Link from "next/link";
import { TOKENS } from "@/styles/tokens";

export const metadata = {
  title: "Page not found | Payless Protocol",
};

export default function NotFound() {
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
            Page not found
          </h1>
          <Link
            href="/"
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
            }}
          >
            Back to home
          </Link>
        </div>
      </body>
    </html>
  );
}
