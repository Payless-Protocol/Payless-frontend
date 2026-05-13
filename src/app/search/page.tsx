"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button, GateShell, Panel, StatusCard, TextInput } from "@/components/gates/GateKit";
import { PAYLESS_ABI } from "@/lib/contract";
import { hashIMEI } from "@/lib/hash";
import { TOKENS } from "@/styles/tokens";
import { formatTimestamp } from "@/lib/status";

// Override type to include notFound field
interface SearchResult {
  flagged: boolean;
  timestamp: bigint;
  formattedDate: string;
  notFound?: boolean;
}

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

const getSearchErrorMessage = (error: Error): string => {
  const msg = error.message.toLowerCase();
  if (msg.includes("network")) return "Network error. Check connection.";
  return "Query failed. Please try again.";
};

export default function SearchPage() {
  const [imei, setImei] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const imeiError = useMemo(() => {
    if (!touched || imei.length === 0) return null;
    return isValidIMEI(imei) ? null : "Invalid device ID";
  }, [imei, touched]);
  const formattedDate = useMemo(() => {
    if (!result?.timestamp || result.timestamp === BigInt(0)) return "";
    return formatTimestamp(result.timestamp);
  }, [result]);

  const handleSearch = async () => {
    if (!isValidIMEI(imei)) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const imeiHash = hashIMEI(imei.trim());
      const contractAddress = "0x90afC5fDaD522Bd0a71CE62Cf3b28cA024DCb392" as `0x${string}`;

      // Use publicClient directly so we can handle 0x response
      const { createPublicClient, http, encodeFunctionData, decodeFunctionResult } = await import("viem");
      const { baseSepolia } = await import("viem/chains");

      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http("https://sepolia.base.org"),
      });

      // Encode the call
      const calldata = encodeFunctionData({
        abi: PAYLESS_ABI,
        functionName: "registry",
        args: [imeiHash],
      });

      // Raw eth_call — does not throw on 0x response
      const raw = await publicClient.call({
        to: contractAddress,
        data: calldata,
      });

      // If result is empty or 0x — device was never flagged
      if (!raw.data || raw.data === "0x") {
        setResult({
          flagged: false,
          timestamp: BigInt(0),
          formattedDate: "Never registered",
          notFound: true,
        });
        setLoading(false);
        return;
      }

      // Decode the result
      const decoded = decodeFunctionResult({
        abi: PAYLESS_ABI,
        functionName: "registry",
        data: raw.data,
      }) as readonly [`0x${string}`, bigint, number];

      const secretHash = decoded[0];
      const updateAt = decoded[1];
      const statusValue = Number(decoded[2]);

      // Check if secretHash is zero (unflagged/retrieved device)
      const isZeroHash =
        secretHash ===
        "0x0000000000000000000000000000000000000000000000000000000000000000";

      if (statusValue === 0 || isZeroHash) {
        setResult({
          flagged: false,
          timestamp: updateAt,
          formattedDate:
            updateAt > BigInt(0) ? formatTimestamp(updateAt) : "Never registered",
          notFound: updateAt === BigInt(0),
        });
      } else {
        // statusValue === 1 — device is flagged
        setResult({
          flagged: true,
          timestamp: updateAt,
          formattedDate: formatTimestamp(updateAt),
          notFound: false,
        });
      }
    } catch (err) {
      console.error("[SearchPage] error:", err);
      setError("Query failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <GateShell maxWidth={760}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ marginBottom: 12, color: TOKENS.muted, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
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
            Look up a 15-digit IMEI to see whether it has been reported lost or stolen.
          </div>
        </div>

        <Panel style={{ maxWidth: 520 }}>
          <TextInput value={imei} onChange={(v) => { setImei(v.replace(/\D/g, "").slice(0, 15)); setTouched(true); }} placeholder="Enter 15-digit IMEI" />
          <Button fullWidth loading={loading} onClick={handleSearch} variant="primary" style={{ marginTop: 24 }}>Check Status</Button>
        </Panel>

        {result && (
          result.flagged ? (
            <StatusCard
              tone="danger"
              icon={<WarningIcon />}
              title="Device Reported Lost or Stolen"
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
            </StatusCard>
          ) : (
            <StatusCard
              tone="success"
              icon={<CheckIcon />}
              title={result.notFound ? "No Registry Entry" : "Device Not Reported"}
            >
              {result.notFound ? (
                <>
                  No registry entry was found for this IMEI.
                </>
              ) : (
                <>
                  No reports were found for IMEI ending in ...{imei.slice(-4)}.
                </>
              )}
            </StatusCard>
          )
        )}
        {error && <StatusCard tone="danger" icon={<WarningIcon />} title="Error">{error}</StatusCard>}
      </GateShell>
    </>
  );
}
