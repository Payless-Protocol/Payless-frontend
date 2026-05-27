"use client";

import type { CSSProperties, ButtonHTMLAttributes, ReactNode } from "react";
import { TOKENS } from "@/styles/tokens";

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ animation: "gate-spin 0.85s linear infinite" }}
    >
      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  children: ReactNode;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  style?: CSSProperties;
};

export function Button({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const variantStyle =
    variant === "primary"
      ? {
          background: "linear-gradient(135deg, #4a7cf7, #6b9bff)",
          color: TOKENS.heading,
          border: "none",
          boxShadow: "0 12px 28px rgba(74,124,247,0.24)",
        }
      : {
          background: "transparent",
          color: TOKENS.heading,
          border: `1.5px solid ${TOKENS.inputBorder}`,
          boxShadow: "none",
        };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      style={{
        width: "100%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: TOKENS.buttonRadius,
        padding: "13px 22px",
        fontFamily: "'Syne', sans-serif",
        fontSize: 15,
        fontWeight: 700,
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.5 : 1,
        transition: "all 0.2s ease",
        ...variantStyle,
        ...style,
      }}
    >
      {loading ? <Spinner /> : null}
      <span>{children}</span>
    </button>
  );
}
