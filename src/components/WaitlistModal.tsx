"use client";

import { useState, useEffect, useCallback, type CSSProperties } from "react";
import { TOKENS } from "@/styles/tokens";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fieldStyle: CSSProperties = {
  width: "100%",
  background: "#E4E1DB",
  border: "1px solid rgba(24,26,24,0.35)",
  borderRadius: 10,
  padding: "13px 16px",
  color: TOKENS.inkText,
  fontFamily: "var(--font-poppins), sans-serif",
  fontSize: 14,
  outline: "none",
};

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setName("");
      setEmail("");
      setStatus("idle");
      setErrorMsg("");
    }, 300);
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "loading") handleClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, status, handleClose]);

  const handleSubmit = async () => {
    if (!name.trim() || !email.includes("@") || !email.includes(".")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={() => {
        if (status !== "loading") handleClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(11,22,76,0.65)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: TOKENS.cream,
          border: "1px solid rgba(24,26,24,0.12)",
          borderRadius: 24,
          padding: "36px 32px",
          width: "100%",
          maxWidth: 420,
          position: "relative",
          boxShadow: "0 40px 80px rgba(11,22,76,0.4)",
        }}
      >
        <button
          onClick={() => {
            if (status !== "loading") handleClose();
          }}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            width: 32,
            height: 32,
            background: "rgba(24,26,24,0.08)",
            border: "1px solid rgba(24,26,24,0.15)",
            borderRadius: 8,
            color: TOKENS.inkText,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {status === "idle" || status === "loading" ? (
          <>
            <div
              style={{
                width: 52,
                height: 52,
                background: "rgba(30,62,217,0.12)",
                border: "1px solid rgba(30,62,217,0.22)",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                color: TOKENS.blue,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>

            <h2 style={{ fontFamily: "var(--font-poppins), sans-serif", fontSize: 24, fontWeight: 800, color: TOKENS.inkText, textAlign: "center", marginBottom: 8 }}>
              Join the Waitlist
            </h2>
            <p style={{ fontFamily: "var(--font-poppins), sans-serif", fontSize: 14, color: TOKENS.inkMuted, textAlign: "center", maxWidth: 320, margin: "0 auto 26px" }}>
              Be among the first to use Payless Protocol when we launch. We&apos;ll notify you directly.
            </p>

            <label style={{ fontFamily: "var(--font-poppins), sans-serif", fontSize: 13, fontWeight: 600, color: TOKENS.inkText, display: "block", marginBottom: 8 }}>
              Your Name
            </label>
            <input type="text" placeholder="e.g. John Doe" value={name} onChange={(e) => setName(e.target.value)} style={{ ...fieldStyle, marginBottom: 14 }} />

            <label style={{ fontFamily: "var(--font-poppins), sans-serif", fontSize: 13, fontWeight: 600, color: TOKENS.inkText, display: "block", marginBottom: 8 }}>
              Email Address
            </label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={fieldStyle} />

            <button
              onClick={handleSubmit}
              disabled={!name.trim() || !email.includes("@") || status === "loading"}
              style={{
                width: "100%",
                marginTop: 20,
                background: TOKENS.ink,
                border: "none",
                borderRadius: 10,
                padding: "14px",
                color: TOKENS.white,
                fontFamily: "var(--font-poppins), sans-serif",
                fontSize: 15,
                fontWeight: 700,
                cursor: !name.trim() || !email.includes("@") || status === "loading" ? "not-allowed" : "pointer",
                opacity: !name.trim() || !email.includes("@") || status === "loading" ? 0.45 : 1,
              }}
            >
              {status === "loading" ? "Joining..." : "Join Waitlist"}
            </button>
          </>
        ) : status === "success" ? (
          <>
            <div
              style={{
                width: 64,
                height: 64,
                background: "rgba(149,200,139,0.22)",
                border: "1px solid rgba(149,200,139,0.5)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                color: "#3f7a35",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "var(--font-poppins), sans-serif", fontSize: 22, fontWeight: 800, color: TOKENS.inkText, textAlign: "center", marginBottom: 10 }}>
              You&apos;re on the list
            </h2>
            <p style={{ fontFamily: "var(--font-poppins), sans-serif", fontSize: 14, color: TOKENS.inkMuted, textAlign: "center", maxWidth: 300, margin: "0 auto 26px" }}>
              We&apos;ll email {name} when the waitlist opens.
            </p>
            <button
              onClick={handleClose}
              style={{
                width: "100%",
                background: "rgba(24,26,24,0.08)",
                border: "1px solid rgba(24,26,24,0.15)",
                borderRadius: 10,
                padding: "13px",
                color: TOKENS.inkText,
                fontFamily: "var(--font-poppins), sans-serif",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Got it
            </button>
          </>
        ) : (
          <>
            <div
              style={{
                width: 64,
                height: 64,
                background: "rgba(169,38,38,0.12)",
                border: "1px solid rgba(169,38,38,0.3)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                color: TOKENS.danger,
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "var(--font-poppins), sans-serif", fontSize: 20, fontWeight: 800, color: TOKENS.danger, textAlign: "center", marginBottom: 10 }}>
              Something went wrong
            </h2>
            <p style={{ fontFamily: "var(--font-poppins), sans-serif", fontSize: 13, color: TOKENS.inkMuted, textAlign: "center", marginBottom: 22 }}>
              {errorMsg ? `${errorMsg.split(".")[0].trim()}.` : "Please try again in a moment."}
            </p>
            <button
              onClick={() => {
                setStatus("idle");
                setErrorMsg("");
              }}
              style={{
                width: "100%",
                background: "rgba(24,26,24,0.08)",
                border: "1px solid rgba(24,26,24,0.15)",
                borderRadius: 10,
                padding: "13px",
                color: TOKENS.inkText,
                fontFamily: "var(--font-poppins), sans-serif",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
