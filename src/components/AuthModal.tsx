"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { TOKENS } from "@/styles/tokens";

type ConnectType = "coinbase" | "metamask" | "walletconnect";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function Spinner({ size = 18, color = TOKENS.accent }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "auth-spin 0.7s linear infinite" }}
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppLogoBlock() {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        margin: "0 auto 20px",
        borderRadius: 14,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src="/logo.png"
        alt="Payless Protocol"
        style={{
          width: 36,
          height: 36,
          objectFit: "contain",
          borderRadius: 8,
          display: "block",
        }}
      />
    </div>
  );
}

function WalletConnectMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5.4 8.85a11.5 11.5 0 0 1 13.2 0l.44.38a.45.45 0 0 1 0 .68l-1.5 1.38a.23.23 0 0 1-.32 0l-.6-.52a8 8 0 0 0-9.24 0l-.65.56a.23.23 0 0 1-.32 0L4.96 9.91a.45.45 0 0 1 0-.68l.44-.38zm16.3 2.8 1.34 1.22a.45.45 0 0 1 0 .68l-6.03 5.5a.46.46 0 0 1-.63 0l-4.28-3.9a.12.12 0 0 0-.16 0l-4.28 3.9a.46.46 0 0 1-.63 0L1.0 13.57a.45.45 0 0 1 0-.68l1.34-1.22a.46.46 0 0 1 .63 0l4.28 3.9c.04.04.12.04.16 0l4.28-3.9a.46.46 0 0 1 .63 0l4.28 3.9c.04.04.12.04.16 0l4.28-3.9a.46.46 0 0 1 .63 0z"
        fill="white"
      />
    </svg>
  );
}

function MetaMaskMark() {
  return <span style={{ color: TOKENS.heading, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 12 }}>M</span>;
}

function WalletLogo({
  src,
  alt,
  width,
  height,
  fallback,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  fallback: ReactNode;
}) {
  return (
    <>
      {fallback}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        onError={(event) => {
          (event.target as HTMLImageElement).style.display = "none";
        }}
        style={{
          objectFit: "contain",
          position: "absolute",
          inset: "50% auto auto 50%",
          transform: "translate(-50%, -50%)",
          display: "block",
        }}
      />
    </>
  );
}

function OptionCard({
  title,
  subtitle,
  icon,
  loading,
  onClick,
}: {
  title: string;
  subtitle?: ReactNode;
  icon: ReactNode;
  loading: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "14px 20px",
        background: hovered ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.06)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 12,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.82 : 1,
        transition: "all 0.2s ease",
        transform: hovered && !loading ? "translateY(-1px)" : "translateY(0)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 999,
          background: title.includes("Google") ? "#fff" : title.includes("Coinbase") ? "#0052FF" : "#F6851B",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "0 0 auto",
          position: "relative",
        }}
      >
        {icon}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <span style={{ color: TOKENS.heading, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>
          {title}
        </span>
        {subtitle && (
          <span style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginTop: 2 }}>
            {subtitle}
          </span>
        )}
      </div>
      <div style={{ position: "absolute", right: 20, color: "rgba(255,255,255,0.3)" }}>{loading ? <Spinner size={18} /> : <ChevronIcon />}</div>
    </button>
  );
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [connecting, setConnecting] = useState<ConnectType | null>(null);
  const [rendered, setRendered] = useState(false);
  const [shown, setShown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);


  const truncatedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const connectorMap = useMemo(() => {
    const coinbase = connectors.find(
      (connector) => connector.id === "coinbaseWalletSDK" || connector.name.toLowerCase().includes("coinbase")
    );
    const metamask = connectors.find(
      (connector) =>
        connector.id === "metaMask" ||
        connector.id === "injected" ||
        connector.name.toLowerCase().includes("metamask") ||
        connector.name.toLowerCase().includes("injected")
    );
    const walletconnect = connectors.find(
      (connector) => connector.id === "walletConnect" || connector.name.toLowerCase().includes("walletconnect")
    );

    return {
      coinbase,
      metamask,
      walletconnect,
    };
  }, [connectors]);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      requestAnimationFrame(() => setShown(true));
      return;
    }

    setShown(false);
    const timer = window.setTimeout(() => setRendered(false), 220);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKey);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isConnected && isOpen) {
      const timer = window.setTimeout(() => onClose(), 1800);
      return () => window.clearTimeout(timer);
    }
  }, [isConnected, isOpen, onClose]);

  const handleConnect = async (type: ConnectType) => {
    const connector =
      type === "coinbase"
        ? connectorMap.coinbase
        : type === "metamask"
        ? connectorMap.metamask
        : connectorMap.walletconnect;

    if (!connector) {
      setError("This wallet option is not available in the current browser.");
      return;
    }

    setConnecting(type);
    setError(null);

    try {
      await connectAsync({ connector });
    } catch {
      setError("Connection failed. Please try again.");
    } finally {
      setConnecting(null);
    }
  };

  const busy = connecting !== null || isPending;

  if (!rendered) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.80)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        padding: isMobile ? 0 : 24,
        opacity: shown ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={isMobile ? {
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          maxWidth: "100%",
          background: "#0f0f18",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px 20px 0 0",
          padding: "32px 24px 40px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.45)",
          transform: shown ? "translateY(0)" : "translateY(100%)",
          opacity: shown ? 1 : 0,
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        } : {
          width: "100%",
          maxWidth: 440,
          background: "#0f0f18",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: "32px 36px",
          boxShadow: "0 36px 80px rgba(0,0,0,0.45)",
          transform: shown ? "translateY(0)" : "translateY(16px)",
          opacity: shown ? 1 : 0,
          transition: "all 0.25s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: "linear-gradient(135deg, #4a7cf7, #6b9bff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 12px 24px rgba(74,124,247,0.18)",
              }}
            >
              <span
                style={{
                  color: TOKENS.heading,
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 12,
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                P
              </span>
            </div>
            <span style={{ color: TOKENS.heading, fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600 }}>
              Payless Protocol
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = "rgba(255,255,255,0.1)";
              event.currentTarget.style.color = TOKENS.heading;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "rgba(255,255,255,0.06)";
              event.currentTarget.style.color = "rgba(255,255,255,0.5)";
            }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.5)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {isConnected ? (
          <div style={{ textAlign: "center", padding: "34px 0 10px" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 999,
                margin: "0 auto",
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={TOKENS.success} strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div style={{ marginTop: 20, color: TOKENS.heading, fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800 }}>
              Connected!
            </div>
            <div style={{ marginTop: 6, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
              {truncatedAddress}
            </div>
            <div style={{ marginTop: 12, color: TOKENS.muted, fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>
              Closing...
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginTop: 8, textAlign: "center" }}>
              <AppLogoBlock />
              <h2
                style={{
                  margin: "0 0 8px",
                  color: TOKENS.heading,
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                Get started with Payless
              </h2>
              <p
                style={{
                  margin: "0 auto 28px",
                  maxWidth: 320,
                  color: "rgba(255,255,255,0.45)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                The decentralized stolen device registry on Base.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              <OptionCard
                title="Continue with Coinbase Wallet"
                loading={connecting === "coinbase" || busy}
                onClick={() => void handleConnect("coinbase")}
                icon={
                  <WalletLogo
                    src="https://cdn.cdnlogo.com/logos/c/19/coinbase.svg"
                    alt="Coinbase"
                    width={22}
                    height={22}
                    fallback={<span style={{ color: TOKENS.heading, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 12 }}>C</span>}
                  />
                }
              />

              <OptionCard
                title="Continue with MetaMask"
                loading={connecting === "metamask" || busy}
                onClick={() => void handleConnect("metamask")}
                icon={
                  <WalletLogo
                    src="https://cdn.cdnlogo.com/logos/m/78/metamask.svg"
                    alt="MetaMask"
                    width={22}
                    height={22}
                    fallback={<MetaMaskMark />}
                  />
                }
              />

              <OptionCard
                title="Continue with Google"
                subtitle="Via Coinbase Smart Wallet — select Google inside"
                loading={connecting === "coinbase" || busy}
                onClick={() => void handleConnect("coinbase")}
                icon={
                  <WalletLogo
                    src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
                    alt="Google"
                    width={18}
                    height={18}
                    fallback={<GoogleMark />}
                  />
                }
              />
              <div style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 8, marginBottom: 4 }}>
                Google login is available inside the Coinbase Smart Wallet flow
              </div>
            </div>

            {error ? (
              <div
                style={{
                  marginTop: 12,
                  color: TOKENS.danger,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            ) : null}
          </>
        )}
      </div>

      <style>{`
        @keyframes auth-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
