"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import SharedNavbar from "./Navbar";
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

function Navbar() {
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
          <img
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
          <NavLink label="search" />
          <NavLink label="Report" />
          <NavLink label="Retrieve" />
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

function HeroBlob({ isMobile }: { isMobile: boolean }) {
  if (isMobile) return null;
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
        padding: isMobile ? "100px 24px 60px" : "160px 60px 80px",
        animation: "fadeSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) both",
      }}
    >
      <HeroBlob isMobile={isMobile} />

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
          The decentralized IMEI registry that protects buyers, sellers, and marketplaces.
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
          Payless Protocol makes stolen devices risky to buy or sell. Instantly flag an
          IMEI on-chain and create a trusted record anyone can verify in seconds.
          Built on Base — the Carfax for mobile devices.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 14,
            marginBottom: 28,
          }}
        >
          <HoverButton
            variant="primary"
            size="lg"
            leftIcon={<SearchIcon size={16} />}
            style={{ 
              borderRadius: 10, 
              paddingLeft: 20, 
              paddingRight: 20,
              width: isMobile ? "100%" : "auto"
            }}
            hoverStyle={{ opacity: 0.88 }}
            href="/search"
          >
            Search IMEI
          </HoverButton>
          <HoverButton
            variant="outline"
            size="lg"
            style={{ 
              borderRadius: 10, 
              paddingLeft: 26, 
              paddingRight: 26,
              width: isMobile ? "100%" : "auto"
            }}
            hoverStyle={{ borderColor: "rgba(255,255,255,0.7)" }}
            href="/report"
          >
            Report Lost Device
          </HoverButton>
        </div>

        <div
          style={{
            color: COLORS.muted,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
          }}
        >
          Built On <span style={{ color: COLORS.accent, fontWeight: 600 }}>Base</span>
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
        boxShadow: accent ? "0 24px 50px rgba(74,124,247,0.12)" : "none",
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
          href={cta === "Retrieve Now" ? "/retrieve" : cta === "Start Searching" ? "/search" : cta === "Report Lost Device" ? "/report" : undefined}
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
        padding: isMobile ? "60px 24px" : "80px 60px",
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
        <SectionBadge style={{ marginBottom: 24 }}>Get to use our powerful tools.</SectionBadge>

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
          Powerful Tools, Built
          <br />
          for Fast <span style={{ color: COLORS.accent }}>Action</span>.
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
                Retrieve <span style={{ color: "#4a7cf7" }}>IMEI</span>
              </>
            }
            desc="Find your IMEI when it's unknown. Let's guide you through simple steps to retrieve it quickly and continue the process."
            cta="Retrieve Now"
            alignButton="flex-start"
          />
          <ToolCard isMobile={isMobile}
            title="Report Lost Or Stole Phone"
            desc="Flags a device as lost or stolen, triggering an alert that helps prevent misuse and boost recovery chances."
            cta="Report Lost Device"
            accent
            alignButton="flex-end"
          />
          <ToolCard isMobile={isMobile}
            title={
              <>
                Search <span style={{ color: "#4a7cf7" }}>IMEI</span> Status
              </>
            }
            desc="Know the status of a device before buying, helping you avoid stolen hardware and buy with confidence."
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
        padding: isMobile ? "60px 24px" : "80px 60px",
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
            height: isMobile ? 260 : 380,
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

        <div style={{ textAlign: isMobile ? "left" : "right" }}>
          <div style={{ display: "flex", justifyContent: isMobile ? "flex-start" : "flex-end" }}>
            <SectionBadge style={{ marginBottom: 24 }}>Benefits.</SectionBadge>
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
            Why <span style={{ color: COLORS.accent }}>Payless</span> Changes Everything.
          </h2>

          <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile ? "flex-start" : "flex-end", gap: 14 }}>
            {["1. Buy With Confidence", "2. Reduced Resale Value for Thieves", "3. Instant Theft Reporting"].map(
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
                    textAlign: isMobile ? "left" : "right",
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
            <SectionBadge>Take action in seconds with fast and trusted device verification.</SectionBadge>

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
              Search an IMEI before you buy or report a lost or stolen device instantly. Payless helps buyers stay safe and makes stolen devices harder to trade.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 14,
                marginBottom: 24,
              }}
            >
              <HoverButton
                variant="primary"
                size="lg"
                leftIcon={<SearchIcon size={16} />}
                style={{ width: isMobile ? "100%" : "auto" }}
                hoverStyle={{ opacity: 0.88 }}
                href="/search"
              >
                Search IMEI
              </HoverButton>
              <HoverButton
                variant="outline"
                size="lg"
                style={{ width: isMobile ? "100%" : "auto" }}
                hoverStyle={{ borderColor: "rgba(255,255,255,0.7)" }}
                onClick={onOpenWaitlist}
              >
                Join Our Waitlist
              </HoverButton>
            </div>

            <div style={{ color: COLORS.muted, fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
              Built On <span style={{ color: COLORS.accent, fontWeight: 600 }}>Base</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <footer
      style={{
        background: "#0a0a0e",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: isMobile ? "40px 24px" : "18px 60px",
      }}
    >
      <div
        style={{
          maxWidth: PAGE_WIDTH,
          margin: "0 auto",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: isMobile ? "center" : "space-between",
          gap: isMobile ? 32 : 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
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

        <nav style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          gap: isMobile ? 16 : 24, 
          flexWrap: "wrap" 
        }}>
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
            { label: "search", href: "/search" },
            { label: "Report", href: "/report" },
            { label: "Retrieve", href: "/retrieve" },
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


  return (
    <>
      <div style={pageStyle}>
      <SharedNavbar />
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
