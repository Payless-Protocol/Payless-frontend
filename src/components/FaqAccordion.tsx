"use client";

import { useState } from "react";
import { TOKENS } from "@/styles/tokens";

export type FaqItem = {
  q: string;
  a: string;
};

function PlusMinus({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        flex: "0 0 auto",
        width: 26,
        height: 26,
        borderRadius: "50%",
        border: `1.5px solid ${TOKENS.ink}`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s ease, transform 0.25s ease",
        background: open ? TOKENS.ink : "transparent",
        transform: open ? "rotate(180deg)" : "none",
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke={open ? TOKENS.cream : TOKENS.ink}
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <line x1="1" y1="6" x2="11" y2="6" />
        {open ? null : <line x1="6" y1="1" x2="6" y2="11" />}
      </svg>
    </span>
  );
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div
            key={item.q}
            style={{
              background: TOKENS.cream,
              borderRadius: 20,
              border: `1.5px solid ${open ? TOKENS.ink : "rgba(24,26,24,0.16)"}`,
              overflow: "hidden",
              transition: "border-color 0.2s ease",
            }}
          >
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`faq-answer-${index}`}
              id={`faq-button-${index}`}
              onClick={() => setOpenIndex(open ? null : index)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 18,
                padding: "20px 22px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--font-poppins), sans-serif",
                fontSize: 15,
                fontWeight: 600,
                lineHeight: 1.4,
                color: TOKENS.inkText,
              }}
            >
              {item.q}
              <PlusMinus open={open} />
            </button>

            <div
              id={`faq-answer-${index}`}
              aria-hidden={!open}
              hidden={!open}
              style={{
                maxHeight: open ? 420 : 0,
                opacity: open ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.32s ease, opacity 0.24s ease",
              }}
            >
              <p
                style={{
                  margin: 0,
                  padding: "0 22px 22px",
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontSize: 13.5,
                  lineHeight: 1.65,
                  color: TOKENS.inkMuted,
                }}
              >
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FaqAccordion;
