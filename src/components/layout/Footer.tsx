import Link from "next/link";
import { TOKENS } from "@/styles/tokens";

const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "#" },
      { label: "Become a partner hub", href: "#" },
      { label: "Contact us", href: "#" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ's", href: "/faq" },
      { label: "Report an issue", href: "/flag" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Registry", href: "/search" },
      { label: "Marketplace", href: "/" },
      { label: "How it works", href: "/#how-it-works" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "#" },
      { label: "Terms and conditions", href: "#" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer style={{ width: "100%", color: TOKENS.inkText }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          gap: 52,
          paddingTop: 8,
        }}
      >
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title} style={{ textAlign: "center" }}>
            <h3
              style={{
                fontFamily: "var(--font-poppins), sans-serif",
                fontSize: 16,
                fontWeight: 500,
                lineHeight: "24px",
                letterSpacing: "0",
                color: TOKENS.inkText,
                textAlign: "left",
                margin: "0 0 12px 0",
              }}
            >
              {column.title}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {column.links.map((link) => (
                <div key={link.label} style={{ textAlign: link.label === "Privacy policy" ? "right" : "center" }}>
                  <Link
                    key={link.label}
                    href={link.href}
                    className="footer-link"
                    style={{
                      fontFamily: "var(--font-bricolage), sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                      lineHeight: "22px",
                      letterSpacing: "0",
                      color: "rgba(24,26,24,0.75)",
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 50,
          textAlign: "center",
          color: "rgba(24,26,24,0.75)",
          fontFamily: "var(--font-bricolage), sans-serif",
          fontSize: 12,
          fontWeight: 600,
          lineHeight: "22px",
          letterSpacing: "0",
        }}
      >
        © Payless {new Date().getFullYear()}. All rights reserved. · Made for Nigeria&apos;s second-hand phone market.
      </div>
    </footer>
  );
}

export default Footer;
