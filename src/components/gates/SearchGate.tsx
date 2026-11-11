"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useDeviceStatus } from "@/hooks/useDeviceStatus";
import { TOKENS } from "@/styles/tokens";

const isValidIMEI = (value: string) => /^\d{15}$/.test(value.trim());

function formatDate(updateAt?: bigint) {
  if (!updateAt || updateAt === 0n) return "Never registered";
  return new Date(Number(updateAt) * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ── Illustrations ─────────────────────────────────────────────── */
function GhostIllustration() {
  return (
    <svg width="104" height="104" viewBox="0 0 104 104" fill="none" aria-hidden="true">
      <defs>
        <clipPath id="ghostClip">
          <circle cx="52" cy="52" r="46" />
        </clipPath>
      </defs>
      <g clipPath="url(#ghostClip)">
        <circle cx="52" cy="52" r="46" fill="#D9E0FB" />
        <path d="M0 80a52 52 0 0 0 104 0Z" fill="#1E3ED9" />
        <ellipse cx="30" cy="44" rx="7" ry="4.5" fill="#fff" opacity="0.95" />
        <ellipse cx="74" cy="40" rx="6" ry="4" fill="#fff" opacity="0.95" />
        <path
          d="M38 58c0-9 6-16 14-16s14 7 14 16v14c0 2-2 3-4 2l-3-2-3 2-4-2-4 2-3-2c-2 1-4 0-4-2V58Z"
          fill="#fff"
        />
        <circle cx="46" cy="54" r="2.2" fill="#181A18" />
        <circle cx="58" cy="54" r="2.2" fill="#181A18" />
        <path d="M50 60c1 1.5 3 1.5 4 0" stroke="#181A18" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function ShieldIllustration() {
  return (
    <svg width="104" height="104" viewBox="0 0 104 104" fill="none" aria-hidden="true">
      <defs>
        <clipPath id="shieldClip">
          <circle cx="52" cy="52" r="46" />
        </clipPath>
      </defs>
      <g clipPath="url(#shieldClip)">
        <circle cx="52" cy="52" r="46" fill="#D9E0FB" />
      </g>
      <path
        d="M52 28l19 7.5V49c0 13-8.4 21.5-19 25.5C41.4 70.5 33 62 33 49V35.5L52 28Z"
        fill="#1E3ED9"
      />
      <path d="M44 51l6 6 12-13" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M77 37l1.6 4.4 4.4 1.6-4.4 1.6L77 49l-1.6-4.4L71 43l4.4-1.6L77 37Z" fill="#fff" />
      <path d="M29 70l1.2 3.3 3.3 1.2-3.3 1.2L29 79l-1.2-3.3L24.5 74.5l3.3-1.2L29 70Z" fill="#fff" />
      <path d="M62 60c4-2.5 6.5-2.5 9 0" stroke="#95C88B" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M66 66c3-1.8 5-1.8 7 0" stroke="#95C88B" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function WarningIllustration() {
  return (
    <svg width="120" height="104" viewBox="0 0 120 104" fill="none" aria-hidden="true">
      <path d="M26 44l9 16H17l9-16Z" fill="#fff" />
      <path d="M92 34l9 16H83l9-16Z" fill="#fff" />
      <path d="M28 72l8 14H20l8-14Z" fill="#fff" />
      <path d="M88 66l8 14H80l8-14Z" fill="#fff" />
      <circle cx="60" cy="30" r="10" fill="#3A2A22" />
      <path d="M50 42h20l5 28H45l5-28Z" fill="#1E3ED9" />
      <path d="M52 70h7l-2 26h-7l2-26Z" fill="#181A18" />
      <path d="M61 70h7l2 26h-7l-2-26Z" fill="#181A18" />
      <path d="M64 46l8 6-8 6V46Z" fill="#B9C3F3" />
      <path d="M42 18l10 18H32l10-18Z" fill="#E86A4D" />
      <path d="M42 24v6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="42" cy="33" r="1.4" fill="#fff" />
    </svg>
  );
}

/* ── UI bits ───────────────────────────────────────────────────── */
function MacDots() {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "rgba(24,26,24,0.55)",
            display: "inline-block",
          }}
        />
      ))}
    </div>
  );
}

function StatusPill({ label, bg }: { label: string; bg: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "7px 14px",
        borderRadius: 999,
        background: bg,
        color: TOKENS.inkText,
        fontFamily: "var(--font-poppins), sans-serif",
        fontSize: 12.5,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function ResultCard({
  tone,
  title,
  badge,
  illustration,
  children,
  action,
}: {
  tone: "notfound" | "clean" | "flagged" | "verified";
  title: string;
  badge: ReactNode;
  illustration: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) {
  const accent =
    tone === "notfound"
      ? TOKENS.notFound
      : tone === "clean"
        ? TOKENS.clean
        : tone === "flagged"
          ? TOKENS.danger
          : TOKENS.blueLightActive;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 540,
        marginTop: 24,
        background: TOKENS.cream,
        borderRadius: 24,
        border: "1px solid rgba(24,26,24,0.10)",
        borderLeft: `4px solid ${accent}`,
        padding: "24px 26px 26px",
        boxShadow: "0 24px 50px rgba(11,22,76,0.16)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h2
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: TOKENS.inkText,
            margin: 0,
          }}
        >
          {title}
        </h2>
        {badge}
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "20px 0 14px" }}>
        {illustration}
      </div>

      <div
        className="overflow-anywhere"
        style={{
          textAlign: "center",
          color: TOKENS.inkMuted,
          fontFamily: "var(--font-poppins), sans-serif",
          fontSize: 13.5,
          lineHeight: 1.6,
        }}
      >
        {children}
      </div>

      {action ? <div style={{ marginTop: 20 }}>{action}</div> : null}
    </div>
  );
}

export function SearchGate() {
  const [imei, setImei] = useState("");
  const [submittedImei, setSubmittedImei] = useState("");
  const [touched, setTouched] = useState(false);

  const imeiError = useMemo(() => {
    if (!touched || imei.length === 0) return null;
    return isValidIMEI(imei) ? null : "IMEI must be exactly 15 digits.";
  }, [imei, touched]);

  const { status, updateAt, secretHash, isLoading, error } =
    useDeviceStatus(submittedImei);

  const showResult = submittedImei.length > 0 && !isLoading && !error;
  const isZeroHash =
    secretHash ===
    "0x0000000000000000000000000000000000000000000000000000000000000000";

  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "100dvh",
          background: TOKENS.blue,
          padding: "128px 24px 90px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: 760, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1
            style={{
              textAlign: "center",
              margin: 0,
              fontFamily: "var(--font-poppins), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(30px, 4.4vw, 44px)",
              letterSpacing: "-0.02em",
              color: TOKENS.white,
            }}
          >
            Check{" "}
            <span
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "1.08em", color: TOKENS.ink
              }}
            >
              imei
            </span>{" "}
            Status
          </h1>
          <p
            style={{
              margin: "12px 0 26px",
              textAlign: "center",
              color: "rgba(255,255,255,0.85)",
              fontFamily: "var(--font-poppins), sans-serif",
              fontSize: 13.5,
            }}
          >
            Look up a 15-digit IMEI to see whether it has been flagged on-chain
          </p>

          {/* Search card */}
          <div
            style={{
              width: "100%",
              maxWidth: 540,
              background: TOKENS.cream,
              borderRadius: 24,
              padding: "22px 22px 22px",
              boxShadow: "0 24px 50px rgba(11,22,76,0.18)",
            }}
          >
            <MacDots />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!isValidIMEI(imei)) {
                  setTouched(true);
                  return;
                }
                setSubmittedImei(imei.trim());
              }}
              style={{ marginTop: 18 }}
            >
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 18,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: TOKENS.inkText,
                    display: "inline-flex",
                    pointerEvents: "none",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </span>
                <input
                  id="search-imei-input"
                  name="imei"
                  aria-label="Enter a 15-digit IMEI"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={imei}
                  disabled={isLoading}
                  inputMode="numeric"
                  placeholder="Enter a 15-digit IMEI"
                  onChange={(e) => {
                    setImei(e.target.value.replace(/\D/g, "").slice(0, 15));
                    setTouched(true);
                  }}
                  style={{
                    width: "100%",
                    height: 54,
                    padding: "0 20px 0 46px",
                    borderRadius: 999,
                    border: `1.5px solid ${imeiError ? TOKENS.danger : "rgba(24,26,24,0.6)"}`,
                    background: "#E4E1DB",
                    color: TOKENS.inkText,
                    fontFamily: "var(--font-poppins), sans-serif",
                    fontSize: 15,
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  height: 54,
                  marginTop: 16,
                  borderRadius: 12,
                  border: "none",
                  background: TOKENS.ink,
                  color: TOKENS.white,
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                Check device status
              </button>
            </form>
            {imeiError ? (
              <div style={{ marginTop: 8, marginLeft: 8, color: TOKENS.danger, fontSize: 12 }}>{imeiError}</div>
            ) : null}
          </div>

          {isLoading ? (
            <div
              role="status"
              aria-live="polite"
              style={{
                width: "100%",
                maxWidth: 540,
                marginTop: 24,
                background: TOKENS.cream,
                borderRadius: 24,
                padding: "22px 26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 700, fontSize: 16, color: TOKENS.inkText }}>
                Searching registry
              </span>
              <span style={{ display: "inline-flex", gap: 7 }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: TOKENS.inkText,
                      display: "inline-block",
                      animation: "pulse 1.1s ease-in-out infinite",
                      animationDelay: `${i * 0.16}s`,
                    }}
                  />
                ))}
              </span>
            </div>
          ) : null}

          {error ? (
            <div role="alert" aria-live="assertive">
              <ResultCard
                tone="flagged"
                title="Search Failed"
                badge={<StatusPill label="Error" bg={TOKENS.flagged} />}
                illustration={<WarningIllustration />}
              >
                {error}
              </ResultCard>
            </div>
          ) : null}

          {showResult && status !== undefined ? (
            status === 1 ? (
              <div role="status" aria-live="polite">
                <ResultCard
                  tone="flagged"
                  title="Device has been flagged"
                badge={<StatusPill label="Flagged" bg={TOKENS.flagged} />}
                illustration={<WarningIllustration />}
                action={
                  <button
                    type="button"
                    style={{
                      width: "100%",
                      height: 52,
                      borderRadius: 12,
                      border: "none",
                      background: TOKENS.danger,
                      color: TOKENS.white,
                      fontFamily: "var(--font-poppins), sans-serif",
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Dispute
                  </button>
                }
              >
                <span style={{ display: "inline-flex", alignItems: "flex-start", gap: 8, textAlign: "left" }}>
                  <span style={{ color: TOKENS.danger, marginTop: 2 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                    </svg>
                  </span>
                  <span>
                    Warning: This device has been flagged as missing/stolen by a user on{" "}
                    {formatDate(updateAt)}. Proceed with caution
                  </span>
                </span>
              </ResultCard>
              </div>
            ) : status === 2 ? (
              <div role="status" aria-live="polite">
                <ResultCard
                  tone="verified"
                  title="Verified Device"
                badge={<StatusPill label="Verified" bg={TOKENS.blueLightActive} />}
                illustration={<ShieldIllustration />}
              >
                This IMEI was verified on {formatDate(updateAt)}.
              </ResultCard>
              </div>
            ) : (
              <div role="status" aria-live="polite">
                <ResultCard
                  tone={isZeroHash ? "notfound" : "clean"}
                  title={isZeroHash ? "No Registry Entry" : "Device Not Flagged"}
                badge={
                  isZeroHash ? (
                    <StatusPill label="Not found" bg={TOKENS.notFound} />
                  ) : (
                    <StatusPill label="Clean" bg={TOKENS.clean} />
                  )
                }
                illustration={isZeroHash ? <GhostIllustration /> : <ShieldIllustration />}
              >
                {isZeroHash
                  ? "No registry entry was found for this IMEI."
                  : `No flagged devices were found for IMEI ending in ...${submittedImei.slice(-4)}.`}
              </ResultCard>
              </div>
            )
          ) : null}

          <div
            style={{
              marginTop: 26,
              color: "rgba(255,255,255,0.72)",
              fontFamily: "var(--font-poppins), sans-serif",
              fontSize: 12.5,
            }}
          >
            Built on <span style={{ fontWeight: 700, color: TOKENS.ink }}>Base</span>
            <span style={{ color: TOKENS.white }}>.</span>
          </div>
        </div>
      </main>
    </>
  );
}

export default SearchGate;
