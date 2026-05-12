"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button, GateShell, Panel, Pill, StatusCard, TextInput } from "@/components/gates/GateKit";
import { PAYLESS_ABI, getContractAddress } from "@/lib/contract";
import { hashIMEI } from "@/lib/hash";
import { config } from "@/lib/wagmi";
import { TOKENS } from "@/styles/tokens";
import { useChainId } from "wagmi";
import { readContract } from "wagmi/actions";
import { isDeviceFlagged, formatTimestamp } from "@/lib/status";

// Result interface for UI
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
    return "Network error. Check your connection.";
  }
  return "Query failed. Please try again.";
};

export default function SearchPage() {
  const chainId = useChainId();
  const [imei, setImei] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formattedDate = useMemo(() => {
    if (!result?.timestamp || result.timestamp === BigInt(0)) return "";
    return formatTimestamp(result.timestamp);
  }, [result]);

  const handleSearch = async () => {
    if (!isValidIMEI(imei)) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const imeiHash = hashIMEI(imei);
      const activeChainId = chainId || 84532;
      console.log(`[SearchPage] activeChainId: ${activeChainId}`);
      
      const data = await readContract(config, {
        address: getContractAddress(activeChainId),
        abi: PAYLESS_ABI,
        functionName: "registry",
        args: [imeiHash],
      });
      
      console.log("[SearchPage] raw data:", data);
      const record = data as readonly [string, bigint, number];
      
      setResult({
        flagged: isDeviceFlagged(Number(record[2])),
        timestamp: record[1] as bigint,
        formattedDate: formatTimestamp(record[1] as bigint),
      });
    } catch (err) {
      console.error("[SearchPage] error:", err);
      const msg = (err as Error).message.toLowerCase();
      
      // Handle "zero data" (0x) error which means device was never flagged
      if (msg.includes("zero data") || msg.includes("0x") || msg.includes("zerodata")) {
        setResult({
          flagged: false,
          timestamp: BigInt(0),
          formattedDate: "Never registered",
          notFound: true
        });
      } else {
        setError(getSearchErrorMessage(err as Error));
      }
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setImei("");
    setResult(null);
    setError(null);
  };

  return (
    <>
      <Navbar />
      <GateShell maxWidth={760}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Pill tone="blue">🔍 Search Gate</Pill>
          <h1 style={{ margin: "22px 0 10px", fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 6vw, 42px)", lineHeight: 1.04, color: TOKENS.heading, fontWeight: 800 }}>
            Search <span style={{ color: TOKENS.accent }}>IMEI</span> Status
          </h1>
          <div style={{ maxWidth: 440, margin: "10px auto 0", color: TOKENS.body, fontSize: 15, lineHeight: 1.7 }}>
            Look up a 15-digit IMEI to see whether it has been reported lost or stolen in the Payless registry.
          </div>
        </div>

        <Panel style={{ maxWidth: 520 }}>
          <TextInput 
            value={imei} 
            onChange={(v) => setImei(v.replace(/\D/g, "").slice(0, 15))} 
            placeholder="Enter 15-digit IMEI" 
            maxLength={15}
            inputMode="numeric"
          />
          <Button fullWidth loading={loading} disabled={!isValidIMEI(imei) || loading} onClick={handleSearch} variant="primary" style={{ marginTop: 24 }}>
            Check Status
          </Button>
        </Panel>

        {result && (
          result.flagged ? (
            <StatusCard 
              tone="danger" 
              icon={<WarningIcon />} 
              title="⚠️ Device Flagged — Do Not Buy"
              action={
                <Link href="/report" style={{ color: TOKENS.heading, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
                  Report a Different Device
                </Link>
              }
            >
              This IMEI was reported lost or stolen on {formattedDate}. Verified on Base blockchain.
            </StatusCard>
          ) : (
            <StatusCard 
              tone="success" 
              icon={<CheckIcon />} 
              title={result.notFound ? "Device Never Flagged ✓" : "Device is Clean"}
            >
              {result.notFound ? (
                <>
                  This IMEI has <strong>never been registered</strong> in the Payless Protocol registry.
                </>
              ) : (
                <>
                  No reports found for IMEI ending in ...{imei.slice(-4)}. This device has not been flagged.
                </>
              )}
            </StatusCard>
          )
        )}

        {error && (
          <StatusCard 
            tone="danger" 
            icon={<ErrorIcon />} 
            title="Query Failed"
            action={<Button variant="outline" onClick={resetSearch}>Try Again</Button>}
          >
            {error}
          </StatusCard>
        )}
      </GateShell>
    </>
  );
}
