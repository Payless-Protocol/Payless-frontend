"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/primitives/Input";
import { StatusBadge } from "@/components/primitives/StatusBadge";
import { useDeviceStatus } from "@/hooks/useDeviceStatus";
import { TOKENS } from "@/styles/tokens";
import { hashIMEI } from "@/lib/hash";
import { HashPreview } from "@/components/primitives/HashPreview";

const isValidIMEI = (value: string) => /^\d{15}$/.test(value.trim());

function formatDate(updateAt?: bigint) {
  if (!updateAt || updateAt === 0n) return "Never registered";
  return new Date(Number(updateAt) * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Card({
  title,
  body,
  tone,
  action,
  badge,
}: {
  title: string;
  body: string;
  tone: "success" | "warning" | "info" | "danger";
  action?: ReactNode;
  badge?: ReactNode;
}) {
  const palette =
    tone === "success"
      ? {
          border: "rgba(34,197,94,0.28)",
          background: "rgba(34,197,94,0.06)",
          title: TOKENS.success,
        }
      : tone === "warning"
        ? {
            border: "rgba(245,158,11,0.28)",
            background: "rgba(245,158,11,0.08)",
            title: "#f59e0b",
          }
        : tone === "danger"
          ? {
              border: "rgba(239,68,68,0.28)",
              background: "rgba(239,68,68,0.06)",
              title: TOKENS.danger,
            }
          : {
              border: "rgba(74,124,247,0.28)",
              background: "rgba(74,124,247,0.08)",
              title: TOKENS.accent,
            };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 560,
        marginTop: 24,
        borderRadius: 16,
        border: `1px solid ${palette.border}`,
        background: palette.background,
        padding: 28,
        boxShadow: "0 14px 32px rgba(0,0,0,0.14)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ flex: "1 1 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                color: palette.title,
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </div>
            {badge}
          </div>
          <div style={{ color: TOKENS.body, fontSize: 14, lineHeight: 1.7 }}>{body}</div>
          {action ? <div style={{ marginTop: 18 }}>{action}</div> : null}
        </div>
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

  const payload = useMemo(() => {
    if (!isValidIMEI(submittedImei)) return null;
    return hashIMEI(submittedImei);
  }, [submittedImei]);

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
          minHeight: "100vh",
          background: TOKENS.background,
          padding: "128px 24px 80px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: 760, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div
              style={{
                marginBottom: 12,
                color: TOKENS.muted,
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Search
            </div>
            <h1
              style={{
                margin: "22px 0 10px",
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(28px, 6vw, 42px)",
                lineHeight: 1.04,
                letterSpacing: "-0.02em",
                color: TOKENS.heading,
                fontWeight: 800,
              }}
            >
              Check <span style={{ color: TOKENS.accent }}>IMEI</span> Status
            </h1>
            <div
              style={{
                maxWidth: 440,
                margin: "10px auto 0",
                color: TOKENS.body,
                fontSize: 15,
                lineHeight: 1.7,
              }}
            >
              Look up a 15-digit IMEI to see whether it has been flagged on-chain.
            </div>
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: 520,
              background: TOKENS.surface,
              border: `1px solid ${TOKENS.borderSubtle}`,
              borderRadius: TOKENS.cardRadius,
              padding: 32,
              boxShadow: "0 14px 32px rgba(0,0,0,0.18)",
            }}
          >
            <Input
              value={imei}
              onChange={(value) => {
                setImei(value.replace(/\D/g, "").slice(0, 15));
                setTouched(true);
              }}
              placeholder="Enter 15-digit IMEI"
              error={imeiError}
              disabled={isLoading}
            />
            <div style={{ marginTop: 20 }}>
              <Button
                loading={isLoading}
                onClick={() => {
                  if (!isValidIMEI(imei)) return;
                  setSubmittedImei(imei.trim());
                }}
              >
                Check Status
              </Button>
            </div>
          </div>

          {isLoading ? (
            <Card
              tone="info"
              title="Searching registry..."
              body="Your IMEI is hashed locally before the contract call is made."
            />
          ) : null}

          {error ? (
            <Card
              tone="danger"
              title="Search Failed"
              body={error}
            />
          ) : null}

          {showResult && status !== undefined ? (
            status === 1 ? (
              <Card
                tone="warning"
                title="Device Reported Lost or Stolen"
                badge={<StatusBadge status={status} />}
                body={`This IMEI was flagged on ${formatDate(updateAt)}.`}
                action={
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <Button variant="secondary" onClick={() => setImei("")} style={{ width: "auto" }}>
                      Search Another IMEI
                    </Button>
                    <Link
                      href="/flag"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "13px 22px",
                        borderRadius: TOKENS.buttonRadius,
                        background: "linear-gradient(135deg, #4a7cf7, #6b9bff)",
                        color: TOKENS.heading,
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 15,
                        fontWeight: 700,
                        textDecoration: "none",
                        boxShadow: "0 12px 28px rgba(74,124,247,0.24)",
                      }}
                    >
                      Flag a Device
                    </Link>
                  </div>
                }
              />
            ) : status === 2 ? (
              <Card
                tone="info"
                title="Verified Device"
                badge={<StatusBadge status={status} />}
                body={`This IMEI was verified on ${formatDate(updateAt)}.`}
                action={<HashPreview hash={payload ?? "0x0000000000000000000000000000000000000000000000000000000000000000"} />}
              />
            ) : (
              <Card
                tone="success"
                title={isZeroHash ? "No Registry Entry" : "Device Not Flagged"}
                badge={<StatusBadge status={status} />}
                body={
                  isZeroHash
                    ? "No registry entry was found for this IMEI."
                    : `No flagged devices were found for IMEI ending in ...${submittedImei.slice(-4)}.`
                }
                action={<HashPreview hash={payload ?? "0x0000000000000000000000000000000000000000000000000000000000000000"} />}
              />
            )
          ) : null}
        </div>
      </main>
    </>
  );
}
