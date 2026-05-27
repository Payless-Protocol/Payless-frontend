"use client";

import Link from "next/link";
import { TOKENS } from "@/styles/tokens";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
  { label: "Flag", href: "/flag" },
  { label: "Recover", href: "/recover" },
] as const;

export function Footer() {
  return (
    <footer
      style={{
        background: "#0a0a0e",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "18px 60px",
      }}
    >
      <div
        style={{
          maxWidth: TOKENS.pageWidth,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, #4a7cf7, #6b9bff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 24px rgba(74,124,247,0.18)",
              flex: "0 0 auto",
            }}
          >
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              P
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              whiteSpace: "nowrap",
            }}
          >
            Payless Protocol
          </span>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          {FOOTER_LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: index === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: index === 0 ? 600 : 400,
                textDecoration: "none",
                padding: index === 0 ? "4px 12px" : "0",
                borderRadius: 6,
                background: index === 0 ? "rgba(255,255,255,0.08)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
