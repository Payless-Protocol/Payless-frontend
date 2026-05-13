"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button, GateShell, Panel, StatusCard, TextInput } from "@/components/gates/GateKit";
import { PAYLESS_ABI, getContractAddress } from "@/lib/contract";
import { hashIMEI } from "@/lib/hash";
import { config } from "@/lib/wagmi";
import { TOKENS } from "@/styles/tokens";
import { useChainId } from "wagmi";
import { readContract } from "wagmi/actions";
import { isDeviceFlagged, formatTimestamp } from "@/lib/status";

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
  const chainId = useChainId();
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
    if (!isValidIMEI(imei)) {
      setTouched(true);
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const imeiHash = hashIMEI(imei);
      const activeChainId = 84532;
      const contractAddress = (
        process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS ||
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
      ) as `0x${string}`;

      let data;
      try {
        data = await readContract(config, {
          address: contractAddress,
          abi: PAYLESS_ABI,
          functionName: "registry",
          args: [imeiHash],
        });
      } catch (innerErr: unknown) {
        // Only treat as error if it's a real network/RPC failure
        console.error("[SearchPage] readContract error:", innerErr);
        throw innerErr;
      }

      const record = data as readonly [`0x${string}`, bigint, number];
      const statusValue = Number(record[2]);
      const secretHash = record[0];

      // Case 1: Never registered (status 0, secretHash is zero bytes)
      const isZeroHash = secretHash === '0x0000000000000000000000000000000000000000000000000000000000000000' 
        || secretHash === '0x' 
        || BigInt(secretHash) === BigInt(0);

      if (statusValue === 0 && isZeroHash) {
        setResult({
          flagged: false,
          timestamp: BigInt(0),
          formattedDate: "Never registered",
          notFound: true,
        });
        setError(null);
        return;
      }

      // Case 2: Device is flagged (status 1)
      if (statusValue === 1) {
        setResult({
          flagged: true,
          timestamp: record[1],
          formattedDate: formatTimestamp(record[1]),
          notFound: false,
        });
        setError(null);
        return;
      }

      // Case 3: Status 0 but has a secretHash (unflagged/retrieved)
      setResult({
        flagged: false,
        timestamp: record[1],
        formattedDate: formatTimestamp(record[1]),
        notFound: false,
      });
      setError(null);
    } catch (err) {
      console.error("[SearchPage] error:", err);
      setError(getSearchErrorMessage(err as Error));
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
