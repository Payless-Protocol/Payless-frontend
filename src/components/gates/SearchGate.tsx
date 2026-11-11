"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useDeviceStatus } from "@/hooks/useDeviceStatus";
import { TOKENS } from "@/styles/tokens";
import {
  GhostIllustration,
  PersonIllustration,
  ShieldIllustration,
} from "@/components/primitives/Illustrations";

const isValidIMEI = (value: string) => /^\d{15}$/.test(value.trim());

const cardShellStyle = {
  width: "100%",
  maxWidth: 547,
  background: TOKENS.ink,
  borderRadius: 25,
  paddingLeft: 5,
} as const;

const cardInnerStyle = {
  width: "100%",
  background: TOKENS.cream,
  borderRadius: 25,
  padding: "clamp(20px, 2.1vw, 30px)",
} as const;

function formatDate(updateAt?: bigint) {
  if (!updateAt || updateAt === 0n) return "Never registered";
  return new Date(Number(updateAt) * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ── Three-dot motif (section 5.5: three 15px Dark circles, 10px gap) ── */
function MacDots() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flex: "0 0 auto" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 15,
            height: 15,
            borderRadius: "50%",
            background: TOKENS.ink,
            display: "inline-block",
          }}
        />
      ))}
    </div>
  );
}

/* ── Status badge (section 10: 28px tall, radius 10, padding 5/10,
      Poppins Medium 12/18, black label) ──────────────────────────────── */
function StatusBadge({ label, bg }: { label: string; bg: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 10px",
        borderRadius: 10,
        background: bg,
        color: "#000000",
        fontFamily: "var(--font-poppins), sans-serif",
        fontSize: 12,
        fontWeight: 500,
        lineHeight: "18px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

/* ── Result card (section 7: 547 backing with 5px accent left edge,
      542 cloud inner, radius 25, padding 20/30) ─────────────────────── */
function ResultCard({
  accent,
  title,
  badge,
  illustration,
  children,
  action,
}: {
  accent: string;
  title: string;
  badge: ReactNode;
  illustration: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div style={{ ...cardShellStyle, background: accent, marginTop: 25 }}>
      <div style={cardInnerStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-poppins), sans-serif",
              fontWeight: 600,
              fontSize: 16,
              lineHeight: "24px",
              color: "#000000",
              margin: 0,
            }}
          >
            {title}
          </h2>
          {badge}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 29 }}>
          {illustration}
        </div>

        <div
          className="overflow-anywhere"
          style={{
            marginTop: 25,
            textAlign: "center",
            color: TOKENS.inkText,
            fontFamily: "var(--font-poppins), sans-serif",
            fontSize: 14,
            fontWeight: 500,
            lineHeight: "21px",
          }}
        >
          {children}
        </div>

        {action ? <div style={{ marginTop: 25 }}>{action}</div> : null}
      </div>
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
          padding: "145px 24px 90px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            margin: 0,
            fontFamily: "var(--font-bricolage), sans-serif",
            fontWeight: 600,
            fontSize: 36,
            lineHeight: "45px",
            letterSpacing: "0",
            color: TOKENS.cream,
          }}
        >
          Check{" "}
          <span
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 36,
              color: TOKENS.ink,
            }}
          >
            imei
          </span>{" "}
          Status
        </h1>
        <p
          style={{
            margin: "25px 0 0",
            textAlign: "center",
            color: "rgba(255,255,255,0.75)",
            fontFamily: "var(--font-poppins), sans-serif",
            fontWeight: 500,
            fontSize: 16,
            lineHeight: "24px",
          }}
        >
          Look up a 15-digit IMEI to see whether it has been flagged on-chain
        </p>

        {/* Search card — 547 backing, 542 cloud inner, radius 25, padding 30 */}
        <div style={{ ...cardShellStyle, marginTop: 25 }}>
          <div style={cardInnerStyle}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <MacDots />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!isValidIMEI(imei)) {
                  setTouched(true);
                  return;
                }
                setSubmittedImei(imei.trim());
              }}
              style={{ marginTop: 30 }}
            >
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: TOKENS.inkText,
                    display: "inline-flex",
                    pointerEvents: "none",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
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
                    height: 56,
                    padding: "0 14px 0 46px",
                    borderRadius: 20,
                    border: `2px solid ${imeiError ? TOKENS.danger : "#000000"}`,
                    background: "transparent",
                    color: TOKENS.inkText,
                    fontFamily: "var(--font-poppins), sans-serif",
                    fontWeight: 500,
                    fontSize: 16,
                    lineHeight: "24px",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  height: 52,
                  marginTop: 30,
                  borderRadius: 16,
                  border: "none",
                  background: TOKENS.ink,
                  color: TOKENS.cream,
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  lineHeight: "24px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                Check device status
              </button>
            </form>
            {imeiError ? (
              <div style={{ marginTop: 8, color: TOKENS.danger, fontFamily: "var(--font-poppins), sans-serif", fontSize: 12, fontWeight: 500, lineHeight: "18px" }}>
                {imeiError}
              </div>
            ) : null}
          </div>
        </div>

        {/* Loading strip — 542 × 64, radius 25, padding 20/30 (section 6.2) */}
        {isLoading ? (
          <div
            role="status"
            aria-live="polite"
            style={{
              width: "100%",
              maxWidth: 542,
              minHeight: 64,
              marginTop: 25,
              background: TOKENS.cream,
              borderRadius: 25,
              padding: "20px 30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-poppins), sans-serif",
                fontWeight: 600,
                fontSize: 16,
                lineHeight: "24px",
                color: "#000000",
              }}
            >
              Searching registry
            </span>
            <span style={{ display: "inline-flex", gap: 10 }}>
              {[1, 0.7, 0.4].map((opacity, i) => (
                <span
                  key={i}
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    background: TOKENS.ink,
                    opacity,
                    display: "inline-block",
                  }}
                />
              ))}
            </span>
          </div>
        ) : null}

        {error ? (
          <div role="alert" aria-live="assertive" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <ResultCard
              accent={TOKENS.danger}
              title="Search Failed"
              badge={<StatusBadge label="Error" bg={TOKENS.flagged} />}
              illustration={<PersonIllustration />}
            >
              {error}
            </ResultCard>
          </div>
        ) : null}

        {showResult && status !== undefined ? (
          status === 1 ? (
            <div role="status" aria-live="polite" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <ResultCard
                accent={TOKENS.danger}
                title="Device has been flagged"
                badge={<StatusBadge label="Flagged" bg={TOKENS.flagged} />}
                illustration={<PersonIllustration />}
                action={
                  <button
                    type="button"
                    style={{
                      width: "100%",
                      height: 52,
                      borderRadius: 16,
                      border: "none",
                      background: TOKENS.danger,
                      color: TOKENS.cream,
                      fontFamily: "var(--font-poppins), sans-serif",
                      fontSize: 16,
                      fontWeight: 600,
                      lineHeight: "24px",
                      cursor: "pointer",
                    }}
                  >
                    Dispute
                  </button>
                }
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    textAlign: "left",
                  }}
                >
                  <span style={{ color: TOKENS.danger, flex: "0 0 auto" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                    </svg>
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-poppins), sans-serif",
                      fontWeight: 500,
                      fontSize: 12,
                      lineHeight: "18px",
                      color: TOKENS.danger,
                    }}
                  >
                    Warning: This device has been flagged as missing/stolen by a user on{" "}
                    {formatDate(updateAt)}. Proceed with caution
                  </span>
                </span>
              </ResultCard>
            </div>
          ) : status === 2 ? (
            <div role="status" aria-live="polite" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <ResultCard
                accent={TOKENS.blueLightActive}
                title="Verified Device"
                badge={<StatusBadge label="Verified" bg={TOKENS.blueLightActive} />}
                illustration={<ShieldIllustration />}
              >
                This IMEI was verified on {formatDate(updateAt)}.
              </ResultCard>
            </div>
          ) : (
            <div role="status" aria-live="polite" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <ResultCard
                accent={isZeroHash ? TOKENS.notFound : TOKENS.clean}
                title={isZeroHash ? "No Registry Entry" : "Device Not Flagged"}
                badge={
                  isZeroHash ? (
                    <StatusBadge label="Not found" bg={TOKENS.notFound} />
                  ) : (
                    <StatusBadge label="Clean" bg={TOKENS.clean} />
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

        {/* Attribution (section 6.3: Poppins Medium 16/24, 608 box, white 75% + Dark "Base") */}
        <div
          style={{
            width: "100%",
            maxWidth: 608,
            marginTop: 25,
            textAlign: "center",
            color: "rgba(255,255,255,0.75)",
            fontFamily: "var(--font-poppins), sans-serif",
            fontWeight: 500,
            fontSize: 16,
            lineHeight: "24px",
          }}
        >
          Built on <span style={{ color: TOKENS.ink }}>Base</span>
          <span>.</span>
        </div>
      </main>
    </>
  );
}

export default SearchGate;
