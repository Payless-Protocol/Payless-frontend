"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button, GateShell, Panel, Pill, StatusCard, TextInput } from "@/components/gates/GateKit";
import { PAYLESS_ABI } from "@/lib/contract";
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

const getSearchErrorMessage = (error: Error): string => {
  const msg = error.message.toLowerCase();
  if (msg.includes("network")) return "Network error. Check connection.";
  return "Query failed. Please try again.";
};

export default function SearchPage() {
  const chainId = useChainId();
  const [imei, setImei] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParsedDeviceResult | null>(null);
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
      const contractAddr = "0x90afC5fDaD522Bd0a71CE62Cf3b28cA024DCb392" as `0x${string}`;

      const data = await readContract(config, {
        address: contractAddr,
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

  return (
    <>
      <Navbar />
      <GateShell maxWidth={760}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Pill tone="blue">🔍 Search Gate</Pill>
          <h1 style={{ margin: "22px 0 10px", fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 6vw, 42px)", lineHeight: 1.04, color: TOKENS.heading, fontWeight: 800 }}>
            Search <span style={{ color: TOKENS.accent }}>IMEI</span> Status
          </h1>
        </div>

        <Panel style={{ maxWidth: 520 }}>
          <TextInput value={imei} onChange={(v) => setImei(v.replace(/\D/g, "").slice(0, 15))} placeholder="Enter 15-digit IMEI" />
          <Button fullWidth loading={loading} onClick={handleSearch} variant="primary" style={{ marginTop: 24 }}>Check Status</Button>
        </Panel>

        {result && (
          result.flagged ? (
            <StatusCard tone="danger" icon={<WarningIcon />} title="⚠️ Device Flagged — Do Not Buy">
              Reported on {formattedDate}. Verified on Base blockchain.
            </StatusCard>
          ) : (
            <StatusCard tone="success" icon={<CheckIcon />} title="Device is Clean">
              No reports found for IMEI ending in ...{imei.slice(-4)}.
            </StatusCard>
          )
        )}
        {error && <StatusCard tone="danger" title="Error">{error}</StatusCard>}
      </GateShell>
    </>
  );
}
