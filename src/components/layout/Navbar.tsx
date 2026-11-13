"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthEntry } from "@/components/auth/AuthEntry";
import { TOKENS } from "@/styles/tokens";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
  { label: "Retrieve", href: "/retrieve" },
  { label: "Flag device", href: "/flag" },
] as const;

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: active || hovered ? TOKENS.cream : "rgba(203,200,197,0.55)",
        fontFamily: "var(--font-poppins), sans-serif",
        fontSize: 15,
        fontWeight: active ? 600 : 500,
        textDecoration: "none",
        transition: "color 0.2s ease",
      }}
    >
      {label}
    </Link>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      {open ? (
        <>
          <path d="M18 6 6 18" />
          <path d="M6 6l12 12" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close menu on Escape, outside tap; lock body scroll while open
  useEffect(() => {
    if (!menuOpen) return undefined;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    const onClick = (e: MouseEvent) => {
      const panel = document.getElementById("mobile-menu-panel");
      const toggle = document.querySelector('button[aria-label="Toggle menu"]');
      const path = e.composedPath();
      const insidePanel = panel ? path.includes(panel) : false;
      const insideToggle = toggle ? path.includes(toggle) : false;
      const insidePrivyModal = path.some(
        (node) => node instanceof HTMLElement && node.closest?.("#privy-modal-content")
      );
      if (panel && toggle && !insidePanel && !insideToggle && !insidePrivyModal) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 95,
          padding: isMobile ? "0 20px" : "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: TOKENS.blue,
          backdropFilter: "none",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          transition: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: TOKENS.pageWidth,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
              flex: "0 0 auto",
            }}
          >
            <Image
              src="/frame-61.png"
              alt="Payless Protocol"
              width={35}
              height={35}
              priority
              style={{
                width: 35,
                height: 35,
                display: "block",
              }}
            />
            <span
              style={{
                color: TOKENS.cream,
                fontFamily: "var(--font-poppins), sans-serif",
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
              }}
            >
              Payless Protocol
            </span>
          </Link>

          {!isMobile ? (
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: 38,
              }}
            >
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  active={pathname === link.href}
                />
              ))}
            </nav>
          ) : null}

          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "0 0 auto" }}>
            {isMobile ? (
              <button
                type="button"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu-panel"
                onClick={() => setMenuOpen((v) => !v)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  minWidth: 44,
                  minHeight: 44,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.24)",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 2,
                }}
              >
                <MenuIcon open={menuOpen} />
              </button>
            ) : (
              <AuthEntry />
            )}
          </div>
        </div>
      </header>

      {isMobile && menuOpen ? (
        <nav
          id="mobile-menu-panel"
          aria-label="Mobile navigation"
          style={{
            position: "fixed",
            top: 95,
            left: 0,
            right: 0,
            zIndex: 95,
            background: TOKENS.blue,
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={pathname === link.href}
            />
          ))}
          <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
            <AuthEntry />
          </div>
        </nav>
      ) : null}
    </>
  );
}

export default Navbar;
