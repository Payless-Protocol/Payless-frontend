import Link from "next/link";
import Image from "next/image";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TOKENS } from "@/styles/tokens";

const PAGE_WIDTH = 1384;
const INK_SOFT = "#2E2F2D";

/* ── Icons ─────────────────────────────────────────────────────── */
function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true">
      <circle cx={11} cy={11} r={8} />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1={5} y1={12} x2={19} y2={12} />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* ── Reusable bits ─────────────────────────────────────────────── */
function Pill({ children, variant = "registry", style }: { children: ReactNode; variant?: "registry" | "glass"; style?: CSSProperties }) {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    fontFamily: "var(--font-poppins), sans-serif",
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "0.01em",
    textAlign: "center",
    lineHeight: 1,
    whiteSpace: "nowrap",
  };

  const variantStyle: CSSProperties =
    variant === "glass"
      ? {
          ...base,
          padding: "6px 12px",
          background: "rgba(185,195,243,0.22)",
          border: "1px solid rgba(185,195,243,0.5)",
          color: TOKENS.cream,
        }
      : {
          ...base,
          minWidth: 112,
          height: 39,
          padding: "0 14px",
          background: TOKENS.blueLightActive,
          border: `2px solid ${TOKENS.ink}`,
          color: TOKENS.inkText,
        };

  return <span style={{ ...variantStyle, ...style }}>{children}</span>;
}

type BtnVariant = "dark" | "outline" | "inkOutline";

function Button({
  children,
  href,
  variant = "dark",
  icon,
  iconRight,
  style,
}: {
  children: ReactNode;
  href: string;
  variant?: BtnVariant;
  icon?: ReactNode;
  iconRight?: ReactNode;
  style?: CSSProperties;
}) {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "13px 24px",
    borderRadius: 999,
    fontFamily: "var(--font-poppins), sans-serif",
    fontSize: 15,
    fontWeight: 500,
    textDecoration: "none",
    whiteSpace: "nowrap",
    transition: "transform 0.2s ease, opacity 0.2s ease, background 0.2s ease, border-color 0.2s ease",
  };

  const variants: Record<BtnVariant, CSSProperties> = {
    dark: { background: TOKENS.ink, color: TOKENS.cream, border: "1px solid transparent" },
    outline: { background: "transparent", color: TOKENS.cream, border: `1px solid ${TOKENS.cream}` },
    inkOutline: { background: "transparent", color: TOKENS.inkText, border: `1px solid ${TOKENS.ink}` },
  };

  return (
    <Link href={href} className="payless-btn" style={{ ...base, ...variants[variant], ...style }}>
      {iconRight ? <>{children}{icon}</> : <>{icon}{children}</>}
    </Link>
  );
}

/* ── Sections ──────────────────────────────────────────────────── */
function SendIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="5 3 19 12 5 21" />
      <line x1={19} y1={12} x2={5} y2={12} />
    </svg>
  );
}

function HeroSection() {
  return (
    <section style={{ paddingTop: 150, paddingBottom: 0 }}>
      <div
        style={{
          width: "100%",
          maxWidth: PAGE_WIDTH,
          margin: "0 auto",
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 504,
            maxWidth: "100%",
            height: 38,
            padding: "10px 12px",
            borderRadius: 15,
            background: TOKENS.blueLightActive,
            border: `2px solid ${TOKENS.ink}`,
            color: TOKENS.inkText,
            fontFamily: "var(--font-poppins), sans-serif",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0",
            lineHeight: "18px",
            marginBottom: 25,
          }}
        >
          The decentralized IMEI registry that protects buyers, sellers, and marketplaces.
        </span>

        <h1
          style={{
            display: "block",
            fontFamily: "var(--font-bricolage), sans-serif",
            fontWeight: 600,
            fontSize: 85,
            lineHeight: 1.25,
            letterSpacing: "0",
            color: TOKENS.cream,
            margin: "25px 0 0",
            textAlign: "center",
            width: 878,
            maxWidth: "100%",
          }}
        >
          Make stole device
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-playfair), serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: 85,
              lineHeight: 1.25,
              letterSpacing: "0",
              color: TOKENS.ink,
              margin: 0,
              textAlign: "center",
            }}
          >
            worthless<span style={{ color: TOKENS.cream }}>.</span>
          </span>
        </h1>

        <p
          style={{
            maxWidth: 608,
            margin: "25px auto 0",
            color: "rgba(255,255,255,0.75)",
            fontFamily: "var(--font-poppins), sans-serif",
            fontSize: 16,
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          Payless Protocol makes stolen devices risky to buy or sell. Instantly flag an
          IMEI on-chain and create a trusted record anyone can verify in seconds. Built on
          Base — the Carfax for mobile devices.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 14,
            flexWrap: "wrap",
            marginTop: 25,
          }}
        >
          <Button
            href="/search"
            variant="outline"
            icon={<SearchIcon size={16} />}
            style={{
              width: 148,
              height: 49,
              padding: "14px 18px",
              borderRadius: 16,
              fontSize: 14,
              fontWeight: 600,
              color: TOKENS.cream,
              background: "transparent",
              border: `2px solid ${TOKENS.cream}`,
              letterSpacing: "0",
              justifyContent: "flex-start",
              whiteSpace: "nowrap",
            }}
          >
            Search IMEI
          </Button>
          <Button
            href="/flag"
            variant="dark"
            icon={<SendIcon size={16} />}
            iconRight
            style={{
              width: 177,
              height: 49,
              padding: "14px 18px",
              borderRadius: 16,
              fontSize: 14,
              fontWeight: 600,
              color: TOKENS.cream,
              background: TOKENS.ink,
              border: "none",
              letterSpacing: "0",
              justifyContent: "flex-start",
              whiteSpace: "nowrap",
            }}
          >
            Flag lost device
          </Button>
        </div>

        <div
          style={{
            marginTop: 25,
            color: "rgba(255,255,255,0.75)",
            fontFamily: "var(--font-poppins), sans-serif",
            fontWeight: 500,
            fontSize: 16,
            lineHeight: 1.5,
          }}
        >
          Built on <span style={{ fontWeight: 500, color: TOKENS.ink }}>Base</span>.
        </div>
      </div>
    </section>
  );
}

/* Custom icons per design spec — replace with Figma SVG exports in /public/icons when available. */
function RecoverIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="2.5" width={11} height={11} rx={3} />
      <rect x="10.5" y="10.5" width={11} height={11} rx={3} />
      <path d="M6 8h4a1.5 1.5 0 0 1 1.5 1.5V11" />
      <path d="m9.6 10.6 1.9 1.9 1.9-1.9" />
      <path d="M18 16h-4a1.5 1.5 0 0 1-1.5-1.5V13" />
      <path d="m14.4 13.4-1.9-1.9-1.9 1.9" />
    </svg>
  );
}

function AlarmIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 17a8 8 0 0 1 16 0" />
      <path d="M3 20.5h18" />
      <path d="M12 9v3.5" />
      <path d="M8.2 9.8A4.5 4.5 0 0 1 12 8" />
      <path d="M15.8 9.8A4.5 4.5 0 0 0 12 8" />
      <path d="M12 2.2v1.4" />
      <path d="m6.6 4 1 1.2" />
      <path d="m17.4 4-1 1.2" />
    </svg>
  );
}

function SearchRefreshIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.5 3a7.5 7.5 0 1 0 4.6 13.4" />
      <path d="M10.5 0.9v4.2l-2-2" />
      <path d="m8.5 3.1 2 2 2-2" />
      <path d="m16.6 16.6 4.4 4.4" />
      <path d="M14 7.4a6 6 0 0 1 3-1.1" />
    </svg>
  );
}

function ToolCard({
  title,
  desc,
  cta,
  href,
  icon,
  size,
  step,
  buttonVariant = "overlap",
}: {
  title: string;
  desc: string;
  cta: string;
  href: string;
  icon: ReactNode;
  size: "wide" | "tall";
  step: 1 | 2 | 3;
  buttonVariant?: "overlap" | "below";
}) {
  return (
    <div
      className={[
        "rt-card",
        size === "wide" ? "rt-card--wide" : "rt-card--tall",
        step === 2 ? "rt-card--step2" : step === 3 ? "rt-card--step3" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        background: TOKENS.blueLightActive,
        borderRadius: 25,
        border: `1.5px solid ${TOKENS.ink}`,
        padding: "16.5px 21.5px",
        minHeight: 98.8,
      }}
    >
      <div className="rt-pill">
        {icon}
        <span
          style={{
            fontFamily: "var(--font-bricolage), sans-serif",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: "24px",
            letterSpacing: "0",
            color: TOKENS.inkText,
            marginBottom: 0,
          }}
        >
          {title}
        </span>
      </div>

      <p className="rt-desc">{desc}</p>

      <Link
        href={href}
        className={`rt-btn ${buttonVariant === "below" ? "rt-btn--below" : "rt-btn--overlap"}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 8,
          width: buttonVariant === "below" ? 139 : buttonVariant === "overlap" ? (cta === "Start searching" ? 155 : 156) : 139,
          height: 42,
          padding: "12px 18px",
          borderRadius: 16,
          background: TOKENS.ink,
          color: TOKENS.cream,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0",
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}
      >
        {cta}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function RegistryToolsSection() {
  return (
    <section style={{ paddingTop: 74 }}>
      <div style={{ width: "100%", maxWidth: PAGE_WIDTH, margin: "0 auto", padding: "0 24px" }}>
        <div className="rt-panel">
          <Pill variant="registry" style={{ background: "transparent", border: "none", borderRadius: 0, padding: 0, minWidth: "auto", height: "auto", fontSize: 12, letterSpacing: "0", lineHeight: "18px", color: TOKENS.inkText, justifyContent: "flex-start", textAlign: "left" }}>
            Registry tools
          </Pill>

          <h2
            style={{
              fontFamily: "var(--font-bricolage), sans-serif",
              fontWeight: 600,
              fontSize: 54,
              lineHeight: "81px",
              letterSpacing: "0",
              margin: "28px 0 0",
              maxWidth: 667,
            }}
          >
            <span style={{ color: TOKENS.blue }}>Search, flag,</span>{" "}
            <span style={{ color: TOKENS.inkText }}>or</span>
            <br />
            <span style={{ color: TOKENS.blue }}>recover</span>{" "}
            <span style={{ color: TOKENS.inkText }}>a device record.</span>
          </h2>

          <div className="rt-grid">
            <ToolCard
              title="Retrieve IMEI"
              desc="Find your IMEI when it’s unknown, Let’s guide you through simple steps to retrieve it quickly and continue the process."
              cta="Recover now"
              href="/retrieve"
              icon={<RecoverIcon size={24} />}
              size="wide"
              step={1}
              buttonVariant="below"
            />
            <ToolCard
              title="Report lost phone"
              desc="Flags a device as lost or stolen, triggering an alert that helps prevent misuse and boost recovery chances."
              cta="Flag lost device"
              href="/flag"
              icon={<AlarmIcon size={24} />}
              size="tall"
              step={2}
              buttonVariant="overlap"
            />
            <ToolCard
              title="Search IMEI status"
              desc="Find your IMEI when it’s unknown, Let’s guide you through simple steps to retrieve it quickly and continue the process."
              cta="Start searching"
              href="/search"
              icon={<SearchRefreshIcon size={24} />}
              size="tall"
              step={3}
              buttonVariant="overlap"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    title: "Step 1",
    body: "Enter the IMEI number. That's the phone's serial number — dial *#06# on any phone to find it.",
  },
  {
    title: "Step 2",
    body: "Get a secret phrase. Three random words, you can remember. This is your key to update the report later.",
  },
  {
    title: "Step 3",
    body: "The phone is flagged immediately. Anyone who checks that IMEI from this point on sees it's stolen.",
  },
  {
    title: "Step 4",
    body: "Found your phone? Clear the flag. Use your secret phrase to mark it safe again — no office visit, no waiting.",
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" style={{ paddingTop: 96, scrollMarginTop: 100 }}>
      <div style={{ width: "100%", maxWidth: PAGE_WIDTH, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Pill variant="glass" style={{ fontSize: 12, letterSpacing: "0", lineHeight: "18px", color: TOKENS.cream, background: "rgba(185,195,243,0.25)", border: "none", borderRadius: 10, padding: 0, minWidth: "auto", height: "auto" }}>
            How It Works
          </Pill>
        </div>

        <h2
          style={{
            textAlign: "right",
            fontFamily: "var(--font-bricolage), sans-serif",
            fontWeight: 600,
            fontSize: 54,
            lineHeight: "81px",
            letterSpacing: "0",
            margin: "23px 0 0",
            maxWidth: 669,
          }}
        >
          <span style={{ color: TOKENS.cream }}>Get To </span>
          <span style={{ color: TOKENS.inkText }}>Understand</span>
          <span style={{ color: TOKENS.cream }}>.</span>
        </h2>

        <h3
          style={{
            fontFamily: "var(--font-poppins), sans-serif",
            fontWeight: 500,
            fontSize: 36,
            lineHeight: "54px",
            letterSpacing: "0",
            textAlign: "center",
            margin: "50px 0 0",
            width: 432,
          }}
        >
          <span style={{ color: TOKENS.cream }}>How the </span>
          <span style={{ color: TOKENS.inkText }}>Registry</span>
          <span style={{ color: TOKENS.cream }}> Works.</span>
        </h3>

        <p
          style={{
            width: 658,
            maxWidth: "100%",
            margin: "13px 0 0",
            color: TOKENS.cream,
            fontFamily: "var(--font-poppins), sans-serif",
            fontSize: 12.03582096,
            fontWeight: 500,
            lineHeight: "19.86px",
            letterSpacing: "0",
          }}
        >
          Lost your phone? Enter its IMEI (dial *#06# to find it) and Payless flags it instantly. You&apos;ll get a secret 3-word<br />
          phrase — keep it safe, it&apos;s your key to clear the flag later if you get the phone back. From that moment,<br />
          anyone who checks that IMEI sees it&apos;s stolen.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "210px 210px 210px 215px",
            columnGap: "35px",
            marginTop: 42,
            marginLeft: 15,
          }}
        >
          {STEPS.map((step, index) => (
            <Fragment key={step.title}>
              <div
                style={{
                  background: TOKENS.blueLightActive,
                  borderRadius: 25,
                  border: `1.5px solid ${TOKENS.ink}`,
                  padding: "16.5px 21.5px",
                  minHeight: 98.8,
                  width: index === 3 ? 215 : 210,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-poppins), sans-serif",
                    fontWeight: 600,
                    fontSize: 16,
                    lineHeight: "24px",
                    letterSpacing: "0",
                    color: TOKENS.inkText,
                    marginBottom: 15,
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-poppins), sans-serif",
                    fontSize: 12,
                    lineHeight: "18px",
                    color: TOKENS.inkText,
                  }}
                >
                  {step.body}
                </div>
              </div>
              {index < STEPS.length - 1 ? (
                <div className="hidden items-center justify-center md:flex" style={{ color: TOKENS.cream }}>
                  <ArrowRight size={20} />
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>

        <p
          style={{
            maxWidth: 466,
            margin: "40px 0 0",
            color: TOKENS.cream,
            fontFamily: "var(--font-poppins), sans-serif",
            fontSize: 12.03582096,
            lineHeight: "19.86px",
          }}
        >
          Before you buy, enter the phone&apos;s IMEI (dial *#06# to find it) and Payless
          checks it against the registry instantly. Clean means it&apos;s safe to buy.
          Flagged means walk away — no forms, no waiting.
        </p>
      </div>
    </section>
  );
}

const GALLERY = [
  { src: "/gallery/phone-1.png", height: 273 },
  { src: "/gallery/phone-2.png", height: 212 },
  { src: "/gallery/phone-3.png", height: 345 },
  { src: "/gallery/phone-4.png", height: 303 },
  { src: "/gallery/phone-5.png", height: 255 },
];

function GetStartedSection() {
  return (
    <section style={{ paddingTop: 104, paddingBottom: 40 }}>
      <div style={{ width: "100%", maxWidth: PAGE_WIDTH, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            background: TOKENS.cream,
            borderRadius: 40,
            padding: "50px 50px 30px",
          }}
        >
          <Pill
            style={{
              fontSize: 12,
              letterSpacing: "0",
              lineHeight: "18px",
              color: TOKENS.inkText,
              background: TOKENS.blueLightActive,
              border: `2px solid ${TOKENS.ink}`,
              borderRadius: 15,
              padding: "10px 12px",
              minWidth: "auto",
              height: "auto",
            }}
          >
            Use Payless Now!!!
          </Pill>

          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <h2
              style={{
                fontFamily: "var(--font-bricolage), sans-serif",
                fontWeight: 600,
                fontSize: 54,
                lineHeight: "81px",
                letterSpacing: "0",
                textAlign: "left",
                margin: "15px 0 0",
                maxWidth: 667,
              }}
            >
              <span style={{ color: TOKENS.ink }}>Get started with </span>
              <span style={{ color: TOKENS.blue }}>Payless</span>
              <span style={{ color: TOKENS.ink }}>.</span>
            </h2>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 18 }}>
              <p
                style={{
                  maxWidth: 477,
                  textAlign: "right",
                  color: TOKENS.inkText,
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontSize: 16,
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Check a phone, list one for sale, or just see what&apos;s nearby — no account
                required to browse.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <Button href="/search" variant="inkOutline" icon={<SearchIcon size={16} />}>
                  Search IMEI
                </Button>
                <Button href="/flag" variant="dark" icon={<ArrowRight size={16} />}>
                  Flag lost device
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5 md:items-end md:gap-[50px]">
            {GALLERY.map((item, index) => (
              <div
                key={item.src}
                style={{
                  position: "relative",
                  height: item.height,
                  borderRadius: 20,
                  overflow: "hidden",
                  background: "#BDBAB4",
                }}
              >
                <Image
                  src={item.src}
                  alt={`Payless phone ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 45vw, 208px"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 50 }}>
            <Footer />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PaylessLanding() {
  return (
    <div style={{ minHeight: "100dvh", background: TOKENS.blue, overflowX: "hidden" }}>
      <Navbar />
      <main>
        <HeroSection />
        <RegistryToolsSection />
        <HowItWorksSection />
        <GetStartedSection />
      </main>
    </div>
  );
}
