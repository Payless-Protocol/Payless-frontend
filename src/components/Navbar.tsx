'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useAccount } from "wagmi";
import AuthModal from "@/components/AuthModal";
import { TOKENS } from "@/styles/tokens";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
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
        color: active || hovered ? "#fff" : "rgba(255,255,255,0.5)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        fontWeight: active ? 700 : 400,
        textDecoration: "none",
        transition: "all 0.2s ease",
      }}
    >
      {label}
    </Link>
  );
}

function UserAvatarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shortenedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...`.toUpperCase();
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
          padding: isMobile ? "0 20px" : "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: scrolled ? "rgba(10,10,14,0.98)" : "#0a0a0e",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
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
            position: "relative",
          }}
        >
          {/* Logo Section */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "0 0 auto" }}>
            <Image
              src="/logo.png"
              alt="Payless Protocol"
              width={24}
              height={24}
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                display: "block",
                objectFit: "cover",
              }}
            />
            <span
              style={{
                color: "#fff",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
              }}
            >
              Payless Protocol
            </span>
          </div>

          {/* Center Navigation (Desktop Only) */}
          {!isMobile && (
            <nav
              style={{
                display: "flex",
                alignItems: "center",
                gap: 36,
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {NAV_LINKS.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} active={pathname === link.href} />
              ))}
            </nav>
          )}

          {/* Right Section (Auth) */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: "0 0 auto" }}>
            <AuthModal />
          </div>
        </div>
      </header>

      {/* Mobile-only Authenticated Row */}
      {isMobile && isConnected && address && (
        <div style={{
          position: 'fixed',
          top: 64,
          left: 0,
          right: 0,
          zIndex: 90,
          padding: '16px 20px',
          background: '#0a0a0e',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#3B82F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59,130,246,0.2)',
          }}>
            <UserAvatarIcon size={20} />
          </div>
          <span style={{
            color: '#fff',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 700,
          }}>
            {shortenedAddress}
          </span>
        </div>
      )}
    </>
  );
}
