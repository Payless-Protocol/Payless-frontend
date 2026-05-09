"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import AuthModal from "@/components/AuthModal";
import { TOKENS } from "@/styles/tokens";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "search", href: "/search" },
  { label: "Report", href: "/report" },
  { label: "Retrieve", href: "/retrieve" },
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
        color: active || hovered ? TOKENS.heading : "rgba(255,255,255,0.5)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        textDecoration: "none",
        transition: "all 0.2s ease",
      }}
    >
      {label}
    </Link>
  );
}

function UserIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}


function HamburgerIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}


function PersonPlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}


function CloseIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SignOutIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const connectedLabel = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 64,
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: scrolled ? "rgba(10,10,14,0.95)" : "rgba(10,10,14,0.8)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          transition: "background 0.3s ease",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: TOKENS.pageWidth,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "0 0 auto" }}>
            <Image
              src="/logo.png"
              alt="Payless Protocol"
              width={32}
              height={32}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                display: "block",
                objectFit: "cover",
                flex: "0 0 auto",
              }}
            />
            <span
              style={{
                color: TOKENS.heading,
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}
            >
              Payless Protocol
            </span>
          </div>

          {!isMobile && (
            <nav
              style={{
                display: "flex",
              alignItems: "center",
              gap: 36,
              flex: "1 1 auto",
              justifyContent: "center",
            }}
          >
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} active={pathname === link.href} />
            ))}
          </nav>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: "0 0 auto", marginLeft: isMobile ? "auto" : undefined }}>
            {isConnected && !isMobile && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "8px 18px",
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.22)",
                  borderRadius: 8,
                  color: TOKENS.heading,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: TOKENS.success,
                    boxShadow: "0 0 0 4px rgba(34,197,94,0.12)",
                    flex: "0 0 auto",
                  }}
                />
                <span>{connectedLabel}</span>
              </div>
            )}

            {!isConnected ? (
              <>
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: isMobile ? "8px" : "8px 20px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: 8,
                    color: TOKENS.heading,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {isMobile ? <PersonPlusIcon size={14} /> : "Sign Up"}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: isMobile ? "8px" : "8px 20px",
                    background: "linear-gradient(135deg, #4a7cf7, #6b9bff)",
                    border: "none",
                    borderRadius: 8,
                    color: TOKENS.heading,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {isMobile ? <UserIcon size={14} /> : "Login Now"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => disconnect()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: isMobile ? "8px" : "8px 20px",
                  background: "linear-gradient(135deg, #4a7cf7, #6b9bff)",
                  border: "none",
                  borderRadius: 8,
                  color: TOKENS.heading,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                <span>Sign Out</span>
                <svg width="14" height="14" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      
      </header>

      {isMobile && drawerOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 150, background: "#0a0a0e", display: "flex", flexDirection: "column", padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Image src="/logo.png" alt="Payless Protocol" width={32} height={32} style={{ borderRadius: 8 }} />
              <span style={{ color: TOKENS.heading, fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 15 }}>Payless Protocol</span>
            </div>
            <button type="button" onClick={() => setDrawerOpen(false)} style={{ background: "transparent", border: "none", color: TOKENS.heading, cursor: "pointer" }}>
              <CloseIcon />
            </button>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setDrawerOpen(false)} style={{ padding: 16, fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 600, color: pathname === link.href ? TOKENS.heading : "rgba(255,255,255,0.7)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
            {!isConnected ? (
              <>
                <button type="button" onClick={() => { setAuthOpen(true); setDrawerOpen(false); }} style={{ width: "100%", padding: "14px", background: "transparent", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, color: TOKENS.heading, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600 }}>Sign Up</button>
                <button type="button" onClick={() => { setAuthOpen(true); setDrawerOpen(false); }} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #4a7cf7, #6b9bff)", border: "none", borderRadius: 8, color: TOKENS.heading, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600 }}>Login Now</button>
              </>
            ) : (
              <>
                <div style={{ width: "100%", padding: "14px", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.22)", borderRadius: 8, color: TOKENS.heading, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                   <span style={{ width: 8, height: 8, borderRadius: 999, background: TOKENS.success, boxShadow: "0 0 0 4px rgba(34,197,94,0.12)" }} />
                   {connectedLabel}
                </div>
                <button type="button" onClick={() => { disconnect(); setDrawerOpen(false); }} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #4a7cf7, #6b9bff)", border: "none", borderRadius: 8, color: TOKENS.heading, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <SignOutIcon size={14} />
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}


      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
