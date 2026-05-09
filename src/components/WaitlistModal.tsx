"use client"

import { useState, useEffect } from "react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
  }, [isOpen, status]);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setName("");
      setEmail("");
      setStatus("idle");
      setErrorMsg("");
    }, 300);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.includes("@") || !email.includes(".")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim() 
        }),
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
      onClick={() => { if (status !== "loading") handleClose(); }}
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
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0f0f18",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24,
          padding: "40px",
          width: "100%",
          maxWidth: "440px",
          position: "relative",
        }}
      >
        <button
          onClick={() => { if (status !== "loading") handleClose(); }}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 32,
            height: 32,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
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
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                   stroke="#4a7cf7" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2
                         H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>

            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 8 }}>
              Join the Waitlist
            </h2>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", textAlign: "center", maxWidth: 320, margin: "0 auto", marginBottom: 28 }}>
              Be among the first to use Payless Protocol 
              when we launch. We'll notify you directly.
            </p>

            <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 8 }}>
              Your Name
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "13px 16px",
                color: "#fff",
                width: "100%",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                marginBottom: 14,
                outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = "#4a7cf7"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />

            <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 8 }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "13px 16px",
                color: "#fff",
                width: "100%",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = "#4a7cf7"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />

            <button
              onClick={handleSubmit}
              disabled={!name.trim() || !email.includes("@") || status === "loading"}
              style={{
                width: "100%",
                marginTop: 20,
                background: "linear-gradient(135deg, #4a7cf7, #6b9bff)",
                border: "none",
                borderRadius: "10px",
                padding: "14px",
                color: "#fff",
                fontFamily: "'Syne', sans-serif",
                fontSize: 15,
                fontWeight: 700,
                cursor: (!name.trim() || !email.includes("@") || status === "loading") ? "not-allowed" : "pointer",
                opacity: (!name.trim() || !email.includes("@") || status === "loading") ? 0.4 : 1,
              }}
            >
              {status === "loading" ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2.5"
                       style={{ animation: "spin 0.7s linear infinite",
                                display: "inline", marginRight: 6 }}>
                    <path d="M12 2a10 10 0 0 1 10 10"/>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
                  </svg>
                  Joining...
                </>
              ) : "Join Waitlist"}
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                   stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>

            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 10 }}>
              You're on the list! 🎉
            </h2>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: 300, margin: "0 auto", marginBottom: 28 }}>
              We'll reach out to {name} when Payless Protocol launches.
            </p>

            <button
              onClick={handleClose}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "13px",
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                   stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94
                         a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>

            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#EF4444", textAlign: "center", marginBottom: 10 }}>
              Something went wrong
            </h2>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 24 }}>
              {errorMsg}
            </p>

            <button
              onClick={() => { setStatus("idle"); setErrorMsg(""); }}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "13px",
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
