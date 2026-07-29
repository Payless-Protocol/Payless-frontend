"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import WaitlistModal from "./WaitlistModal";

const COLORS = {
  bg: "#0a0a0e",
  white: "#ffffff",
  body: "rgba(255,255,255,0.5)",
  muted: "rgba(255,255,255,0.35)",
  accent: "#4a7cf7",
  accentLight: "#6b9bff",
  surfaceDark: "rgba(255,255,255,0.04)",
  borderSubtle: "rgba(255,255,255,0.08)",
  borderMid: "rgba(255,255,255,0.15)",
  pillBg: "rgba(255,255,255,0.07)",
  pillBorder: "rgba(255,255,255,0.12)",
  tagBg: "rgba(20,25,60,0.85)",
  tagBorder: "rgba(255,255,255,0.1)",
  ctaBg: "linear-gradient(135deg, #1c0a08, #2e0e0a, #1a0808)",
  heroCardBlue: "linear-gradient(145deg, #5b7fe8, #7399f5)",
};

const PAGE_WIDTH = 1280;

const pageStyle: any = {
  minHeight: "100vh",
  background: COLORS.bg,
  color: COLORS.white,
  overflowX: "hidden",
  position: "relative",
  fontFamily: "'DM Sans', sans-serif",
};

const sectionPad = {
  paddingLeft: 60,
  paddingRight: 60,
};

const pillStyle = {
  display: "inline-block",
  padding: "6px 18px",
  background: COLORS.pillBg,
  border: `1px solid ${COLORS.pillBorder}`,
  borderRadius: 100,
  color: "rgba(255,255,255,0.75)",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.01em",
};

const buttonBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  borderRadius: 10,
  cursor: "pointer",
  transition: "all 0.2s ease",
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 600,
  outline: "none",
  textDecoration: "none",
  userSelect: "none",
  whiteSpace: "nowrap",
  transform: "translateY(0) scale(1)",
};

function SearchIcon({ size = 16 }: any) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function UserIcon({ size = 14 }: any) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogoMark({ size = 32 }: any) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
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
          color: COLORS.white,
          fontWeight: 800,
          fontSize: Math.max(12, size * 0.5),
          lineHeight: 1,
          transform: "translateY(-0.5px)",
        }}
      >
        P
      </span>
    </div>
  );
}

function HoverButton({
  children,
  variant = "primary",
  size = "md",
  rightIcon = null,
  leftIcon = null,
  style = {},
  hoverStyle = {},
  alignSelf,
  onClick,
  href = null,
  type = "button",
  title,
}: any) {
  const [hovered, setHovered] = useState(false);

  const sizeStyle =
    size === "sm"
      ? { padding: "8px 18px", fontSize: 13 }
      : size === "lg"
      ? { padding: "13px 26px", fontSize: 14 }
      : { padding: "10px 22px", fontSize: 13 };

  const variantStyle =
    variant === "primary"
      ? {
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
          border: "none",
          color: COLORS.white,
          boxShadow: hovered
            ? "0 16px 36px rgba(74,124,247,0.28)"
            : "0 12px 28px rgba(74,124,247,0.24)",
        }
      : variant === "dark"
      ? {
          background: "#0a0a0e",
          border: "none",
          color: COLORS.white,
          boxShadow: hovered ? "0 12px 26px rgba(0,0,0,0.28)" : "none",
        }
      : variant === "navPrimary"
      ? {
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
          border: "none",
          color: COLORS.white,
          boxShadow: "0 12px 28px rgba(74,124,247,0.24)",
        }
      : {
          background: "transparent",
          border: `1.5px solid ${hovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)"}`,
          color: COLORS.white,
          boxShadow: hovered ? "0 12px 24px rgba(255,255,255,0.06)" : "none",
        };

  const sharedStyle = {
    ...buttonBase,
    ...sizeStyle,
    ...variantStyle,
    ...style,
    ...(hovered ? hoverStyle : {}),
    alignSelf,
    transform: hovered ? "translateY(-1px) scale(1.02)" : "translateY(0) scale(1)",
  };

  if (href) {
    return (
      <Link
        href={href}
        title={title}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={sharedStyle}
      >
        {leftIcon}
        <span>{children}</span>
        {rightIcon}
      </Link>
    );
  }

  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={sharedStyle}
    >
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
}

function NavLink({ label, active = false, href = "#", style = {} }: any) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: active || hovered ? COLORS.white : "rgba(255,255,255,0.5)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        textDecoration: "none",
        transition: "all 0.2s ease",
        ...style,
      }}
    >
      {label}
    </Link>
  );
}

// TODO: Remove this legacy landing-specific navbar helper after the shared layout navbar fully replaces it.
function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
          maxWidth: PAGE_WIDTH,
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
            }}
          />
          <span
            style={{
              color: COLORS.white,
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

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
            flex: "1 1 auto",
            justifyContent: "center",
          }}
        >
          <NavLink label="Home" active />
          <NavLink label="Search" />
          <NavLink label="Flag" />
          <NavLink label="Recover" />
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: "0 0 auto" }}>
          <HoverButton
            variant="outline"
            size="sm"
            style={{
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "transparent",
            }}
            hoverStyle={{
              borderColor: "rgba(255,255,255,0.6)",
            }}
          >
            Sign Up
          </HoverButton>
          <HoverButton
            variant="navPrimary"
            size="sm"
            style={{
              borderRadius: 8,
              paddingLeft: 20,
              paddingRight: 20,
            }}
            rightIcon={<UserIcon size={14} />}
            hoverStyle={{
              opacity: 0.9,
            }}
          >
            Login Now
          </HoverButton>
        </div>
      </div>
    </header>
  );
}

function SectionBadge({ children, style = {} }: any) {
  return <div style={{ ...pillStyle, ...style }}>{children}</div>;
}

function HeroBlob() {
  return (
    <svg
      viewBox="0 0 400 420"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        right: -40,
        top: "50%",
        transform: "translateY(-52%)",
        width: 400,
        height: 420,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <path
        d="M 80,40 C 160,-20 280,20 340,100 C 410,190 390,310 310,370 
           C 220,440 90,420 40,330 C -20,230 -10,110 80,40 Z"
        fill="none"
        stroke="rgba(74,124,247,0.18)"
        strokeWidth="1.5"
      />
      <path
        d="M 90,55 C 165,-10 275,28 330,108 C 395,198 372,305 295,358 
           C 210,418 88,398 42,312 C -12,218 8,122 90,55 Z"
        fill="rgba(45,65,150,0.45)"
      />
    </svg>
  );
}

function HeroSection() {

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        background: "#0a0a0e",
        overflow: "hidden",
        padding: isMobile ? "24px" : "100px 60px 80px",
      }}
    >
      <HeroBlob />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 640,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <SectionBadge style={{ marginBottom: 36 }}>
          Search, flag, and recover device records from the registry.
        </SectionBadge>

        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: isMobile ? "clamp(38px, 8vw, 82px)" : "clamp(48px, 7vw, 78px)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: COLORS.white,
            margin: "0 0 10px",
          }}
        >
          Make Stolen Devices
        </h1>

        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: isMobile ? "clamp(38px, 8vw, 82px)" : "clamp(48px, 7vw, 78px)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            margin: "0 0 28px",
          }}
        >
          <span style={{ color: COLORS.accent }}>Worth</span>
          <span style={{ color: COLORS.white }}>less.</span>
        </h1>

        <p
          style={{
            maxWidth: 480,
            margin: "0 auto 40px",
            color: COLORS.body,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          Search an IMEI before you buy, flag a lost device from a connected wallet, or
          recover the 15-digit number when you need it.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 14,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          <HoverButton
            variant="primary"
            size="lg"
            leftIcon={<SearchIcon size={16} />}
            style={{ borderRadius: 10, paddingLeft: 20, paddingRight: 20 }}
            hoverStyle={{ opacity: 0.88 }}
            href="/search"
          >
            Search IMEI
          </HoverButton>
          <HoverButton
            variant="outline"
            size="lg"
            style={{ borderRadius: 10, paddingLeft: 26, paddingRight: 26 }}
            hoverStyle={{ borderColor: "rgba(255,255,255,0.7)" }}
          href="/flag"
          >
            Flag Lost Device
          </HoverButton>
        </div>

      </div>
    </section>
  );
}

function ToolCard({ title, desc, cta, accent = false, isMobile = false, alignButton = "flex-start" }: any) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: accent ? 310 : 280,
        padding: 28,
        borderRadius: 20,
        border: accent ? "none" : "1px solid rgba(255,255,255,0.1)",
        background: accent
          ? "linear-gradient(145deg, #5b7fe8, #7399f5)"
          : "rgba(255,255,255,0.04)",
        transform: accent && !isMobile ? "translateY(-14px)" : "translateY(0)",
        boxShadow: accent ? "0 14px 28px rgba(74,124,247,0.1)" : "none",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: accent ? "rgba(0,0,0,0.28)" : "rgba(255,255,255,0.9)",
          marginBottom: 48,
          flex: "0 0 auto",
        }}
      />
      <h3
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 18,
          fontWeight: 700,
          lineHeight: 1.2,
          margin: "0 0 12px",
          color: COLORS.white,
          maxWidth: 260,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          lineHeight: 1.65,
          margin: "0 0 36px",
          color: accent ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.45)",
          maxWidth: 290,
          flex: 1,
        }}
      >
        {desc}
      </p>
      <div style={{ marginTop: "auto", display: "flex", justifyContent: alignButton }}>
        <HoverButton
          variant={accent ? "dark" : "outline"}
          size="sm"
          style={{
            borderRadius: 8,
            padding: "10px 22px",
            background: accent ? "#0a0a0e" : "transparent",
            border: accent ? "none" : "1px solid rgba(255,255,255,0.25)",
            color: COLORS.white,
            fontSize: 13,
            fontWeight: 600,
          }}
          hoverStyle={{
            opacity: 0.9,
          }}
          href={cta === "Recover Now" ? "/recover" : cta === "Start Searching" ? "/search" : cta === "Flag Lost Device" ? "/flag" : undefined}
        >
          {cta}
        </HoverButton>
      </div>
    </div>
  );
}

function ToolsSection() {

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        background: "#0a0a0e",
        padding: "80px 60px",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 28,
          top: 10,
          width: 320,
          height: 320,
          borderRadius: "55% 45% 60% 40% / 50% 55% 45% 50%",
          background: "rgba(74,124,247,0.28)",
          filter: "blur(2px)",
        }}
      />
      <div style={{ maxWidth: PAGE_WIDTH, margin: "0 auto" }}>
        <SectionBadge style={{ marginBottom: 24 }}>Registry tools</SectionBadge>

        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(32px, 4vw, 52px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: COLORS.white,
            margin: "0 0 56px",
            maxWidth: 800,
          }}
        >
          Search, flag, or
          <br />
          recover a device record.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1.1fr 1fr",
            gap: 20,
            alignItems: "start",
          }}
        >
          <ToolCard isMobile={isMobile}
            title={
              <>
                Recover <span style={{ color: "#4a7cf7" }}>IMEI</span>
              </>
            }
            desc="Recover the 15-digit IMEI from a device before you search or flag it."
            cta="Recover Now"
            alignButton="flex-start"
          />
          <ToolCard isMobile={isMobile}
            title="Flag Lost Or Stolen Device"
            desc="Write the device hash and recovery phrase to the registry from a connected wallet."
            cta="Flag Lost Device"
            accent
            alignButton="flex-end"
          />
          <ToolCard isMobile={isMobile}
            title={
              <>
                Search <span style={{ color: "#4a7cf7" }}>IMEI</span> Status
              </>
            }
            desc="Check whether an IMEI is flagged lost or stolen before a purchase."
            cta="Start Searching"
            alignButton="flex-end"
          />
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      style={{
        background: "#0a0a0e",
        padding: "80px 60px",
      }}
    >
      <div
        style={{
          maxWidth: PAGE_WIDTH,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            borderRadius: 20,
            overflow: "hidden",
            height: isMobile ? 280 : 380,
            background: "linear-gradient(160deg, #e8e8ec 0%, #f4f4f6 45%, #d0d0d8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="170" height="320" viewBox="0 0 170 320"
            fill="none" style={{ transform: "rotate(-4deg)" }}>
            <rect x="8" y="0" width="154" height="320" rx="24"
              fill="#1a1a22" stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.5"/>
            <rect x="18" y="12" width="134" height="296" rx="18"
              fill="url(#phoneScreen)"/>
            <rect x="62" y="5" width="46" height="9" rx="4.5"
              fill="#0a0a12"/>
            <defs>
              <linearGradient id="phoneScreen" x1="18" y1="12"
                x2="152" y2="308" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2a7a8a" stopOpacity="0.9"/>
                <stop offset="55%" stopColor="#1a3a6a" stopOpacity="0.95"/>
                <stop offset="100%" stopColor="#060818" stopOpacity="1"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <SectionBadge style={{ marginBottom: 24 }}>What the registry shows</SectionBadge>
          </div>

          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 46px)",
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              color: COLORS.white,
              margin: "0 0 40px",
            }}
          >
            What <span style={{ color: COLORS.accent }}>Payless</span> lets you verify.
          </h2>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14 }}>
            {["Search before purchase", "Flag from a connected wallet", "Recover with the 3-word phrase"].map(
              (benefit) => (
                <div
                  key={benefit}
                  style={{
                    minWidth: 260,
                    padding: "11px 22px",
                    borderRadius: 10,
                    background: COLORS.tagBg,
                    border: `1px solid ${COLORS.tagBorder}`,
                    color: COLORS.white,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: "right",
                  }}
                >
                  {benefit}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection({ onOpenWaitlist }: any) {

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section style={{ background: "#0a0a0e", padding: isMobile ? "0 20px 60px" : "0 60px 100px" }}>
      <div style={{ maxWidth: PAGE_WIDTH, margin: "0 auto" }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 24,
            padding: "72px 40px",
            textAlign: "center",
            border: "1px solid rgba(180,60,40,0.1)",
            backgroundColor: "#1c0a08",
            backgroundImage: 'url("/red.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(80,20,10,0.6), rgba(40,10,10,0.8))",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at center, rgba(255,255,255,0.05), transparent 35%)",
              opacity: 0.6,
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            <SectionBadge>Check a device or flag one from the app.</SectionBadge>

            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: isMobile ? "clamp(28px, 7vw, 64px)" : "clamp(32px, 5vw, 64px)",
                lineHeight: 1.06,
                letterSpacing: "-0.02em",
                color: COLORS.white,
                margin: "24px 0 24px",
              }}
            >
              Protect Your <span style={{ color: COLORS.accent }}>Device</span>. Protect
              <br />
              Your Next <span style={{ color: COLORS.accent }}>Purchase</span>.
            </h2>

            <p
              style={{
                maxWidth: 460,
                margin: "0 auto 36px",
                color: COLORS.body,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                lineHeight: 1.65,
              }}
            >
              Search an IMEI before you buy or flag a lost or stolen device from a connected wallet.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 14,
                flexWrap: "wrap",
                marginBottom: 24,
              }}
            >
              <HoverButton
                variant="primary"
                size="lg"
                leftIcon={<SearchIcon size={16} />}
                hoverStyle={{ opacity: 0.88 }}
                href="/search"
              >
                Search IMEI
              </HoverButton>
              <HoverButton
                variant="outline"
                size="lg"
                hoverStyle={{ borderColor: "rgba(255,255,255,0.7)" }}
                onClick={onOpenWaitlist}
              >
                Join Our Waitlist
              </HoverButton>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// TODO: Remove this legacy footer after confirming the standalone layout/footer component is the only one needed.
function LandingFooter() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          maxWidth: PAGE_WIDTH,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LogoMark size={28} />
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              color: COLORS.white,
              fontWeight: 600,
              fontSize: 14,
              whiteSpace: "nowrap",
            }}
          >
            Payless Protocol
          </span>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <NavLink
            label="Home"
            active
            href="/"
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.9)",
              fontSize: 13,
            }}
          />
          {[
            { label: "Search", href: "/search" },
            { label: "Flag", href: "/flag" },
            { label: "Recover", href: "/recover" },
          ].map((link) => (
            <NavLink 
              key={link.href} 
              label={link.label} 
              href={link.href} 
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.4)",
                padding: "0"
              }}
            />
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default function PaylessLanding() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const { address } = useAccount();
  const router = useRouter();
  
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return (
      <div style={{ ...pageStyle, paddingTop: "64px" }}>
        <Navbar />
        <main>
          {/* MOBILE SECTION 1 — TOP BAR */}
          <div style={{ padding: "20px 20px 0px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4a7cf7, #6b9bff)",
                border: "2px solid rgba(74,124,247,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24"
                     fill="none" stroke="white" strokeWidth="2"
                     strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff" }}>
                {address ? `${address.slice(0, 2)}${address.slice(2, 6)}...` : "Connect Wallet"}
              </div>
            </div>
          </div>

          {/* MOBILE SECTION 2 — HERO HEADING */}
          <div style={{ padding: "0 20px", marginBottom: "24px" }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "32px",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              margin: 0
            }}>
              Get to know your<br />
              device <span style={{ color: "#4a7cf7" }}>status</span>
            </h1>
          </div>

          {/* MOBILE SECTION 3 — SEARCH BAR */}
          <div style={{ padding: "0 20px", marginBottom: "28px" }}>
            <div 
              onClick={() => router.push("/search")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "100px",
                padding: "12px 18px",
                cursor: "pointer"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" style={{ color: "rgba(255,255,255,0.5)" }}>
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.35)", flex: 1 }}>
                Instant device status lookup
              </div>
            </div>
          </div>

          {/* MOBILE SECTION 4 — REPORT CARD */}
          <div style={{ padding: "0 20px", marginBottom: "16px" }}>
            <div style={{
              background: "linear-gradient(145deg, #5b7fe8, #7399f5)",
              borderRadius: "20px",
              padding: "24px",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "48px" }}>
                <div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "4px", margin: 0 }}>
                    Flag.
                  </h2>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.75)", margin: 0 }}>
                    Flag a lost or stolen device
                  </p>
                </div>
                <button 
                  onClick={() => router.push("/flag")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#0a0a0e",
                    border: "none",
                    borderRadius: "100px",
                    padding: "10px 18px",
                    color: "#fff",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Flag Now!
                  <svg width="14" height="14" viewBox="0 0 24 24"
                       fill="none" stroke="white" strokeWidth="2.5"
                       strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, margin: 0 }}>
                Write the device hash and recovery phrase to the registry from a connected wallet.
              </p>
              {/* DECORATIVE CIRCLES */}
              <div style={{
                position: "absolute",
                bottom: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.2)",
                background: "transparent",
                pointerEvents: "none"
              }} />
              <div style={{
                position: "absolute",
                bottom: 5,
                right: 5,
                width: 65,
                height: 65,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.15)",
                background: "transparent",
                pointerEvents: "none"
              }} />
            </div>
          </div>

          {/* MOBILE SECTION 5 — RETRIEVE CARD */}
          <div style={{ padding: "0 20px", marginBottom: "32px" }}>
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "20px",
              padding: "24px",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "4px", margin: 0 }}>
                    Recover
                  </h2>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                    Need your IMEI?
                  </p>
                </div>
                <button 
                  onClick={() => router.push("/recover")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#fff",
                    border: "none",
                    borderRadius: "100px",
                    padding: "10px 18px",
                    color: "#0a0a0e",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Let&apos;s go!
                  <svg width="14" height="14" viewBox="0 0 24 24"
                       fill="none" stroke="#0a0a0e" strokeWidth="2.5"
                       strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginTop: "48px", margin: 0 }}>
                Recover the IMEI before you search or flag a device.
              </p>
              {/* DECORATIVE CIRCLES */}
              <div style={{
                position: "absolute",
                bottom: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.1)",
                background: "transparent",
                pointerEvents: "none"
              }} />
              <div style={{
                position: "absolute",
                bottom: 5,
                right: 5,
                width: 65,
                height: 65,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.07)",
                background: "transparent",
                pointerEvents: "none"
              }} />
            </div>
          </div>
        </main>
        <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
      </div>
    );
  }

  return (
    <>
      <div style={pageStyle}>
      <Navbar />
        <main>
          <HeroSection />
          <ToolsSection />
          <BenefitsSection />
          <CTASection onOpenWaitlist={() => setWaitlistOpen(true)} />
        </main>
        <Footer />
        <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
      </div>
    </>
  );
}
