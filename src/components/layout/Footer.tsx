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
          <div key={column.title} style={{ textAlign: "right" }}>
            <h3
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                color: TOKENS.inkText,
                margin: "0 0 12px 0",
              }}
            >
              {column.title}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="footer-link"
                  style={{
                    fontFamily: "var(--font-poppins), sans-serif",
                    fontSize: 13,
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 50,
          textAlign: "center",
          color: TOKENS.inkMuted,
          fontFamily: "var(--font-poppins), sans-serif",
          fontSize: 12.5,
        }}
      >
        © Payless {new Date().getFullYear()}. All rights reserved. · Made for Nigeria&apos;s second-hand phone market.
      </div>
    </footer>
  );
}

export default Footer;
