"use client";

import type { ChangeEvent } from "react";
import { TOKENS } from "@/styles/tokens";

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  error?: string | null;
};

export function Input({
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
}: InputProps) {
  return (
    <div>
      <input
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        style={{
          width: "100%",
          background: TOKENS.inputBackground,
          border: `1px solid ${error ? TOKENS.danger : TOKENS.inputBorder}`,
          borderRadius: TOKENS.buttonRadius,
          padding: "13px 16px",
          color: TOKENS.heading,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          outline: "none",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          opacity: disabled ? 0.65 : 1,
          cursor: disabled ? "not-allowed" : "text",
        }}
      />
      {error ? <div style={{ marginTop: 8, color: TOKENS.danger, fontSize: 12 }}>{error}</div> : null}
    </div>
  );
}
