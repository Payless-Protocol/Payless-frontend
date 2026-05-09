"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button, GateShell, Panel, Pill, StatusCard, TextInput } from "@/components/gates/GateKit";
import { PAYLESS_ABI, getContractAddress } from "@/lib/contract";
import { hashIMEI } from "@/lib/hash";
import { config } from "@/lib/wagmi";
import { TOKENS } from "@/styles/tokens";
import { useChainId } from "wagmi";
import { readContract } from "wagmi/actions";
import { isDeviceFlagged, formatTimestamp } from "@/lib/status";

import { ParsedDeviceResult } from "@/types";

const isValidIMEI = (value: string) => /^\d{15}$/.test(value.trim());

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke={TOKENS.success} strokeWidth="2" />
      <path d="m7 12.5 3 3 7-7" stroke={TOKENS.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 2.8 19.5h18.4L12 3Z" stroke={TOKENS.danger} strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 9v4" stroke={TOKENS.danger} strokeWidth="2.25" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1" fill={TOKENS.danger} />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke={TOKENS.danger} strokeWidth="2" />
      <path d="m8 8 8 8" stroke={TOKENS.danger} strokeWidth="2.25" strokeLinecap="round" />
      <path d="m16 8-8 8" stroke={TOKENS.danger} strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  );
}

const getSearchErrorMessage = (error: Error): string => {
  const msg = error.message.toLowerCase();
  if (msg.includes("network") || msg.includes("fetch")) {
    return "Network error. Check your connection and try again.";
  }
  if (msg.includes("rpc") || msg.includes("provider")) {
    return "Blockchain connection error. Please try again shortly.";
  }
  return "Query failed. Please try again.";
};

export default function SearchPage() {
  const chainId = useChainId();
  const [imei, setImei] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParsedDeviceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);


  const imeiError = useMemo(() => {
    if (!touched || imei.length === 0) return null;
    return isValidIMEI(imei) ? null : "Invalid device ID";
  }, [imei, touched]);

  const formattedDate = useMemo(() => {
    if (!result?.timestamp || result.timestamp === BigInt(0)) return "";
    return formatTimestamp(result.timestamp);
  }, [result]);

  const handleChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 15);
    setImei(digits);
    setTouched(true);
    setError(null);
    setResult(null);
  };

  const handleSearch = async () => {
    if (!isValidIMEI(imei)) {
      setTouched(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const imeiHash = hashIMEI(imei);
      const activeChainId = chainId || 84532;
      const data = await readContract(config, {
        address: getContractAddress(activeChainId),
        abi: PAYLESS_ABI,
        functionName: "registry",
        args: [imeiHash],
      });
      const record = data as readonly [string, bigint, number];
      setResult({
        flagged: isDeviceFlagged(Number(record[2])),
        timestamp: record[1] as bigint,
        formattedDate: formatTimestamp(record[1] as bigint),
      });
    } catch (err) {
      setError(getSearchErrorMessage(err as Error));
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setImei("");
    setTouched(false);
    setResult(null);
    setError(null);
  };

  return (
    <>
      
        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>

      <Navbar />
      <GateShell maxWidth={760}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Pill tone="blue">🔍 Search Gate</Pill>
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
            Search <span style={{ color: TOKENS.accent }}>IMEI</span> Status
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
            Check if a device has been reported lost or stolen before you buy.
          </div>
        </div>

        <Panel style={{ maxWidth: 520 }}>
          <div>
            <div style={{ marginBottom: 8, color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }}>
              IMEI Number
            </div>
            <TextInput
              value={imei}
              onChange={handleChange}
              placeholder="Enter 15-digit IMEI (e.g. 352099001761481)"
              helper="Your IMEI is never sent to any server. It is hashed locally in your browser before the query."
              error={imeiError}
              maxLength={15}
              inputMode="numeric"
              disabled={loading}
            />
          </div>

          <div style={{ marginTop: 24 }}>
            <Button fullWidth loading={loading} disabled={!isValidIMEI(imei) || loading} onClick={handleSearch} variant="primary">
              {loading ? "Checking..." : "Check Status"}
            </Button>
          </div>
        </Panel>

        {loading ? (
          <Panel style={{ maxWidth: 520, marginTop: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite", borderRadius: 6, height: 20, width: "60%" }} />
              <div style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite", borderRadius: 6, height: 14, width: "90%" }} />
              <div style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite", borderRadius: 6, height: 14, width: "75%" }} />
            </div>
          </Panel>
        ) : null}

        {!loading && result ? (
          result.flagged ? (
            <StatusCard
              tone="danger"
              icon={<WarningIcon />}
              title="⚠️ Device Flagged — Do Not Buy"
              action={
                <Link
                  href="/report"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 16px",
                    borderRadius: 10,
                    background: "transparent",
                    border: "1px solid rgba(239,68,68,0.28)",
                    color: TOKENS.heading,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Report a Different Device
                </Link>
              }
            >
              This IMEI was reported lost or stolen on {formattedDate || "an unknown date"}.
              <div style={{ marginTop: 12, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>
                Verified on Base blockchain
              </div>
            </StatusCard>
          ) : (
            <StatusCard
              tone="success"
              icon={<CheckIcon />}
              title="Device is Clean"
              footer={formattedDate ? `Last checked: ${formattedDate}` : undefined}
            >
              No reports found for IMEI ending in ...{imei.slice(-4)}. This device has not been flagged on the Payless
              Protocol registry.
              {!formattedDate ? (
                <div style={{ marginTop: 12, color: "rgba(255,255,255,0.72)", fontSize: 13 }}>
                  Always verify in person before completing any purchase.
                </div>
              ) : null}
            </StatusCard>
          )
        ) : null}

        {!loading && error ? (
          <StatusCard
            tone="danger"
            icon={<ErrorIcon />}
            title="Query Failed"
            action={
              <Button variant="outline" onClick={resetSearch}>
                Try Again
              </Button>
            }
          >
            {error}
          </StatusCard>
        ) : null}
      </GateShell>
    </>
  );
}
