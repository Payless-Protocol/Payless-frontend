"use client";

import { useEffect, useState } from "react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !email.includes("@")) return;
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

  const handleClose = () => {
    if (status === "loading") return;
    onClose();
    setTimeout(() => {
      setName("");
      setEmail("");
      setStatus("idle");
      setErrorMsg("");
    }, 300);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "loading") {
        handleClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, status]);

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
        background: "rgba(0,0,0,0.80)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0f0f18",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: 40,
          width: "100%",
          maxWidth: 440,
          position: "relative",
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.5)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: status === "loading" ? "not-allowed" : "pointer",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {status === "idle" || status === "loading" ? (
          <>
            <div
              style={{
                width: 52,
                height: 52,
                background: "rgba(74,124,247,0.1)",
                border: "1px solid rgba(74,124,247,0.2)",
                borderRadius: 14,
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a7cf7" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 8, marginTop: 0 }}>
              Join the Waitlist
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", textAlign: "center", maxWidth: 320, margin: "0 auto 28px" }}>
              Be among the first to use Payless Protocol when we launch. We'll notify you directly.
            </p>

            <div style={{ marginBottom: 8, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>
              Your Name
            </div>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "13px 16px",
                color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                width: "100%",
                marginBottom: 14,
                outline: "none",
              }}
              onFocus={(e) => e.target.style.borderColor = "#4a7cf7"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />

            <div style={{ marginBottom: 8, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>
              Email Address
            </div>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "13px 16px",
                color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                width: "100%",
                outline: "none",
              }}
              onFocus={(e) => e.target.style.borderColor = "#4a7cf7"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />

            <button
              onClick={handleSubmit}
              disabled={email.trim() === "" || !email.includes("@") || name.trim() === "" || status === "loading"}
              style={{
                width: "100%",
                marginTop: 20,
                background: "linear-gradient(135deg, #4a7cf7, #6b9bff)",
                border: "none",
                borderRadius: 10,
                padding: 14,
                color: "#fff",
                fontFamily: "'Syne', sans-serif",
                fontSize: 15,
                fontWeight: 700,
                cursor: (email.trim() === "" || !email.includes("@") || name.trim() === "" || status === "loading") ? "not-allowed" : "pointer",
                opacity: (email.trim() === "" || !email.includes("@") || name.trim() === "" || status === "loading") ? 0.4 : 1,
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
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.25)",
                borderRadius: "50%",
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 12, marginTop: 0 }}>
              You're on the list! 🎉
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: 300, margin: "0 auto 28px" }}>
              We'll reach out to {name} at {email} when Payless Protocol launches.
            </p>
            <button
              onClick={handleClose}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: 13,
                color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
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
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "50%",
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#EF4444", textAlign: "center", marginBottom: 12, marginTop: 0 }}>
              Something went wrong
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center", margin: "0 auto 28px" }}>
              {errorMsg}
            </p>
            <button
              onClick={() => {
                setStatus("idle");
                setErrorMsg("");
              }}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: 13,
                color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
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
