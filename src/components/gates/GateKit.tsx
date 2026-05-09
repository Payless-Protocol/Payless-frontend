"use client";

import { useState, useEffect, type CSSProperties, type InputHTMLAttributes, type ReactNode } from "react";
import { TOKENS } from "@/styles/tokens";

const shellStyle: CSSProperties = {
  minHeight: "100vh",
  background: TOKENS.background,
  paddingTop: 64,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "64px 20px 80px",
  fontFamily: "'DM Sans', sans-serif",
  animation: "fadeSlideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) both",
};

const contentStyle: CSSProperties = {
  width: "100%",
  maxWidth: 760,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export function GateShell({
  children,
  maxWidth = 760,
}: {
  children: ReactNode;
  maxWidth?: number;
}) {
  return (
    <main style={shellStyle}>
      <div style={{ ...contentStyle, maxWidth }}>{children}</div>
    </main>
  );
}

export function Pill({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: "blue" | "red" | "green";
}) {
  const tones = {
    blue: { background: "rgba(74,124,247,0.12)", border: "rgba(74,124,247,0.3)", color: TOKENS.accent },
    red: { background: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", color: TOKENS.danger },
    green: { background: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)", color: TOKENS.success },
  } as const;

  const theme = tones[tone];

  return (
    <div
      style={{
        display: "inline-block",
        padding: "5px 14px",
        borderRadius: 999,
        background: theme.background,
        border: `1px solid ${theme.border}`,
        color: theme.color,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  );
}

export function Panel({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        background: TOKENS.surface,
        border: `1px solid ${TOKENS.borderSubtle}`,
        borderRadius: TOKENS.cardRadius,
        padding: isMobile ? 20 : 40,
        boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
        backdropFilter: "blur(10px)",
        ...style,
        ...(isMobile ? { maxWidth: "100%" } : {}),
      }}
    >
      {children}
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        color: "rgba(255,255,255,0.7)",
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  helper,
  error,
  maxLength,
  type = "text",
  inputMode,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  helper?: string;
  error?: string | null;
  maxLength?: number;
  type?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  disabled?: boolean;
}) {
  return (
    <div>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        maxLength={maxLength}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: TOKENS.inputBackground,
          border: `1px solid ${error ? TOKENS.danger : TOKENS.inputBorder}`,
          borderRadius: TOKENS.buttonRadius,
          padding: "13px 16px",
          minHeight: 48,
          color: TOKENS.heading,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          outline: "none",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          opacity: disabled ? 0.65 : 1,
          cursor: disabled ? "not-allowed" : "text",
        }}
        onFocus={(event) => {
          event.currentTarget.style.borderColor = TOKENS.inputFocusBorder;
          event.currentTarget.style.boxShadow = "0 0 0 3px rgba(74,124,247,0.14)";
        }}
        onBlur={(event) => {
          event.currentTarget.style.borderColor = error ? TOKENS.danger : TOKENS.inputBorder;
          event.currentTarget.style.boxShadow = "none";
        }}
      />
      {helper ? (
        <div style={{ marginTop: 6, color: TOKENS.muted, fontSize: 11, lineHeight: 1.5 }}>{helper}</div>
      ) : null}
      {error ? <div style={{ marginTop: 8, color: TOKENS.danger, fontSize: 12 }}>{error}</div> : null}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  leftIcon,
  rightIcon,
  style,
  type = "button",
}: {
  children: ReactNode;
  variant?: "primary" | "danger" | "success" | "outline" | "dark";
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: CSSProperties;
  type?: "button" | "submit";
}) {
  const variants: Record<typeof variant, CSSProperties> = {
    primary: {
      background: "linear-gradient(135deg, #4a7cf7, #6b9bff)",
      color: TOKENS.heading,
      border: "none",
      boxShadow: "0 12px 28px rgba(74,124,247,0.24)",
    },
    danger: {
      background: "linear-gradient(135deg, #EF4444, #f87171)",
      color: TOKENS.heading,
      border: "none",
      boxShadow: "0 12px 28px rgba(239,68,68,0.22)",
    },
    success: {
      background: "linear-gradient(135deg, #22C55E, #4ade80)",
      color: TOKENS.heading,
      border: "none",
      boxShadow: "0 12px 28px rgba(34,197,94,0.22)",
    },
    outline: {
      background: "transparent",
      color: TOKENS.heading,
      border: "1.5px solid rgba(255,255,255,0.3)",
      boxShadow: "none",
    },
    dark: {
      background: TOKENS.surfaceElevated,
      color: TOKENS.heading,
      border: `1px solid ${TOKENS.borderSubtle}`,
      boxShadow: "none",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: fullWidth ? "100%" : "auto",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: TOKENS.buttonRadius,
        padding: "13px 22px",
        minHeight: 52,
        fontFamily: "'Syne', sans-serif",
        fontSize: 15,
        fontWeight: 700,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.45 : 1,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: "translateY(0) scale(1)",
        ...variants[variant],
        ...style,
      }}
      onMouseEnter={(event) => {
        if (disabled || loading) return;
        event.currentTarget.style.transform = "translateY(-1px) scale(1.02)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "translateY(0) scale(1)";
      }}
    >
      {loading ? <Spinner /> : null}
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
}

export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ animation: "gate-spin 0.85s linear infinite" }}
    >
      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.22)" strokeWidth="3" />
      <path
        d="M21 12a9 9 0 0 1-9 9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ConnectWalletCard({
  onConnect,
  isConnecting,
  address,
}: {
  onConnect: () => void;
  isConnecting: boolean;
  address?: string | null;
}) {
  return (
    <Panel style={{ maxWidth: 520, textAlign: "center", padding: 36 }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 18,
          background: "rgba(255,255,255,0.06)",
          border: `1px solid ${TOKENS.borderSubtle}`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 11V8a5 5 0 0 1 10 0v3"
            stroke={TOKENS.accent}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="5" y="11" width="14" height="9" rx="2" stroke={TOKENS.heading} strokeWidth="2" />
        </svg>
      </div>
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          color: TOKENS.heading,
          fontSize: 24,
          fontWeight: 800,
          marginBottom: 10,
          letterSpacing: "-0.02em",
        }}
      >
        Connect Your Wallet
      </div>
      <div style={{ color: TOKENS.body, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
        You need to connect a wallet to use this feature.
        {address ? (
          <div style={{ marginTop: 8, color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
            Connected: {address}
          </div>
        ) : null}
      </div>
      <Button fullWidth onClick={onConnect} loading={isConnecting} variant="primary">
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    </Panel>
  );
}

export function StatusCard({
  tone,
  icon,
  title,
  children,
  footer,
  action,
}: {
  tone: "success" | "danger" | "neutral";
  icon: ReactNode;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  action?: ReactNode;
}) {
  const tones = {
    success: {
      border: "rgba(34,197,94,0.3)",
      background: "rgba(34,197,94,0.06)",
    },
    danger: {
      border: "rgba(239,68,68,0.3)",
      background: "rgba(239,68,68,0.06)",
    },
    neutral: {
      border: TOKENS.borderSubtle,
      background: TOKENS.surface,
    },
  } as const;

  const theme = tones[tone];

  return (
    <Panel
      style={{
        maxWidth: 560,
        padding: 28,
        borderRadius: 16,
        background: theme.background,
        border: `1px solid ${theme.border}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ flex: "0 0 auto" }}>{icon}</div>
        <div style={{ flex: "1 1 auto" }}>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              color: tone === "danger" ? TOKENS.danger : tone === "success" ? TOKENS.success : TOKENS.heading,
              fontSize: 20,
              fontWeight: 800,
              marginBottom: 8,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          <div style={{ color: TOKENS.body, fontSize: 14, lineHeight: 1.7 }}>{children}</div>
          {footer ? <div style={{ marginTop: 14, color: TOKENS.muted, fontSize: 12 }}>{footer}</div> : null}
          {action ? <div style={{ marginTop: 18 }}>{action}</div> : null}
        </div>
      </div>
    </Panel>
  );
}

export function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        marginTop: 10,
        background: "rgba(0,0,0,0.3)",
        borderRadius: 8,
        padding: "10px 14px",
        fontFamily:
          'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
        fontSize: 11,
        color: "rgba(255,255,255,0.5)",
        wordBreak: "break-all",
      }}
    >
      {children}
    </div>
  );
}

export function MiniStepCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div
      style={{
        flex: "1 1 160px",
        maxWidth: 160,
        background: TOKENS.surface,
        border: `1px solid ${TOKENS.borderSubtle}`,
        borderRadius: 12,
        padding: "16px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          background: "linear-gradient(135deg, #4a7cf7, #6b9bff)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: TOKENS.heading,
          fontFamily: "'Syne', sans-serif",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {number}
      </div>
      <div style={{ marginTop: 10, color: TOKENS.heading, fontSize: 13, fontWeight: 600 }}>{title}</div>
      <div style={{ marginTop: 6, color: "rgba(255,255,255,0.45)", fontSize: 11, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}
