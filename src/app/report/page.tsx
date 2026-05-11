"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import {
  Button,
  CodeBlock,
  ConnectWalletCard,
  GateShell,
  Panel,
  Pill,
  Spinner,
  TextInput,
} from "@/components/gates/GateKit";
import { useAccount, useChainId, useConnect, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useCapabilities, useSendCalls, useCallsStatus } from "wagmi/experimental";
import { encodeFunctionData } from "viem";
import { hashIMEI, hashSecret } from "@/lib/hash";
import { PAYLESS_ABI } from "@/lib/contract";
import { getTxUrl } from "@/lib/basescan";
import { TOKENS } from "@/styles/tokens";

const isValidIMEI = (value: string) => /^\d{15}$/.test(value.trim());

const getReportErrorMessage = (error: Error): string => {
  const msg = error.message.toLowerCase();
  if (msg.includes("invalidimei")) return "IMEI hash rejected. Ensure it's 15 digits.";
  if (msg.includes("invalidsecret")) return "Secret rejected. Ensure all 3 words are filled.";
  if (msg.includes("user rejected") || msg.includes("rejected the request")) return "Transaction cancelled.";
  return "Transaction failed. Please try again.";
};

function GreenCheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke={TOKENS.success} strokeWidth="2" />
      <path d="m7 12.5 3 3 7-7" stroke={TOKENS.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RedXIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke={TOKENS.danger} strokeWidth="2" />
      <path d="m8 8 8 8" stroke={TOKENS.danger} strokeWidth="2.25" strokeLinecap="round" />
      <path d="m16 8-8 8" stroke={TOKENS.danger} strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  );
}

function BlueSpinner() {
  return <Spinner size={18} />;
}

function TxStateCard({
  title,
  body,
  icon,
  link,
  linkLabel,
  secondary,
  tone = "blue",
  action,
}: {
  title: string;
  body: string;
  icon: ReactNode;
  link?: string;
  linkLabel?: string;
  secondary?: string;
  tone?: "blue" | "green" | "red";
  action?: React.ReactNode;
}) {
  const palette = tone === "green" ? { border: "rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.06)", title: TOKENS.success }
    : tone === "red" ? { border: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", title: TOKENS.danger }
    : { border: "rgba(74,124,247,0.28)", background: "rgba(74,124,247,0.08)", title: TOKENS.accent };

  return (
    <div style={{ marginTop: 24, width: "100%", maxWidth: 560, borderRadius: 16, border: `1px solid ${palette.border}`, background: palette.background, padding: 28, boxShadow: "0 24px 60px rgba(0,0,0,0.24)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ flex: "0 0 auto" }}>{icon}</div>
        <div style={{ flex: "1 1 auto" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", color: palette.title, fontSize: 20, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>{title}</div>
          <div style={{ color: TOKENS.body, fontSize: 14, lineHeight: 1.7 }}>{body}</div>
          {secondary && <div style={{ marginTop: 12, color: "rgba(255,255,255,0.72)", fontSize: 13 }}>{secondary}</div>}
          {link && linkLabel && (
            <div style={{ marginTop: 14 }}>
              <a href={link} target="_blank" rel="noreferrer" style={{ color: TOKENS.accent, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>{linkLabel}</a>
            </div>
          )}
          {action && <div style={{ marginTop: 18 }}>{action}</div>}
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connectAsync, connectors, isPending: isWalletConnecting } = useConnect();
  const { writeContract, data: txHash, isPending: isWritePending, error: writeError, reset: resetWrite } = useWriteContract();
  const [submittedHash, setSubmittedHash] = useState<`0x${string}` | undefined>(undefined);
  const { isLoading: isWaitConfirming, isSuccess: isWaitConfirmed, error: waitError } = useWaitForTransactionReceipt({ hash: submittedHash });

  const { data: capabilities } = useCapabilities();
  const { sendCalls, data: callsIdData, isPending: isSendCallsPending, error: sendCallsError, reset: resetSendCalls } = useSendCalls();
  const actualCallsId = typeof callsIdData === "string" ? callsIdData : (callsIdData as any)?.id;
  const { data: callsStatus } = useCallsStatus({ id: actualCallsId as string, query: { enabled: !!actualCallsId } });

  const [imei, setImei] = useState("");
  const [words, setWords] = useState(["", "", ""]);
  const [confirmed, setConfirmed] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [hashPreview, setHashPreview] = useState("");
  const [manualError, setManualError] = useState<string | null>(null);

  const activeChainId = chainId || 84532;

  const handleFlag = () => {
    setSubmitAttempted(true);
    setManualError(null);

    if (!isValidIMEI(imei)) {
      setManualError("IMEI must be exactly 15 digits.");
      return;
    }
    if (words.some(w => !w.trim() || w.trim().length < 2)) {
      setManualError("Each secret word must be at least 2 characters.");
      return;
    }
    
    if (!confirmed || isWritePending || isSendCallsPending || isWaitConfirming || !address) return;

    const contractAddr = "0x90afC5fDaD522Bd0a71CE62Cf3b28cA024DCb392" as `0x${string}`;
    const imeiHash = hashIMEI(imei.trim());
    const secretHash = hashSecret(words);

    try {
      const calldata = encodeFunctionData({
        abi: PAYLESS_ABI,
        functionName: "flagDevice",
        args: [imeiHash, secretHash],
      });

      if (capabilities?.[activeChainId]?.paymasterService?.supported) {
        sendCalls({
          account: address,
          calls: [{ to: contractAddr, data: calldata, value: 0n }],
          capabilities: { paymasterService: { url: process.env.NEXT_PUBLIC_PAYMASTER_URL! } },
        });
      } else {
        writeContract({
          address: contractAddr,
          abi: PAYLESS_ABI,
          functionName: "flagDevice",
          args: [imeiHash, secretHash],
          chainId: activeChainId,
        });
      }
    } catch (err) {
      setManualError("Failed to prepare transaction.");
    }
  };

  useEffect(() => {
    if (txHash) setSubmittedHash(txHash as `0x${string}`);
  }, [txHash]);

  const transactionError = manualError ? new Error(manualError) : (writeError ?? waitError ?? sendCallsError);
  const currentTxHash = txHash || callsStatus?.receipts?.[0]?.transactionHash;
  const txUrl = currentTxHash ? getTxUrl(currentTxHash as `0x${string}`, activeChainId) : "";

  if (!isConnected) {
    return (
      <><Navbar /><GateShell maxWidth={760}><ConnectWalletCard onConnect={() => connectAsync({ connector: connectors[0] })} isConnecting={isWalletConnecting} address={address} /></GateShell></>
    );
  }

  return (
    <>
      <Navbar />
      <GateShell maxWidth={760}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Pill tone="red"> Report Gate</Pill>
          <h1 style={{ margin: "22px 0 10px", fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 6vw, 42px)", lineHeight: 1.04, letterSpacing: "-0.02em", color: TOKENS.heading, fontWeight: 800 }}>
            Report <span style={{ color: TOKENS.danger }}>Lost or Stolen</span> Device
          </h1>
          <div style={{ maxWidth: 480, margin: "10px auto 0", color: TOKENS.body, fontSize: 15, lineHeight: 1.7 }}>
            Flag your device IMEI on-chain. Once flagged, any buyer can instantly see it has been reported.
          </div>
        </div>

        <Panel style={{ maxWidth: 560 }}>
          <TextInput
            value={imei}
            onChange={(v) => setImei(v.replace(/\D/g, "").slice(0, 15))}
            placeholder="Enter 15-digit IMEI"
            error={submitAttempted && !isValidIMEI(imei) ? "Invalid IMEI" : null}
          />
          <div style={{ marginTop: 20 }}>
            <label style={{ display: "flex", gap: 10, color: TOKENS.body, fontSize: 13 }}>
              <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
              I confirm this is my device and I am flagging it as lost or stolen.
            </label>
          </div>
          <Button fullWidth loading={isWritePending || isSendCallsPending || isWaitConfirming} onClick={handleFlag} variant="danger" style={{ marginTop: 20 }}>
            Flag Device on Base
          </Button>
        </Panel>

        {(isWritePending || isSendCallsPending) && <TxStateCard tone="blue" icon={<BlueSpinner />} title="Submitting..." body="Confirm in your wallet." />}
        {isWaitConfirming && <TxStateCard tone="blue" icon={<BlueSpinner />} title="Waiting..." body="Confirming on Base Sepolia." link={txUrl} linkLabel="View on Explorer" />}
        {isWaitConfirmed && <TxStateCard tone="green" icon={<GreenCheckIcon />} title="Success!" body="Device flagged." link={txUrl} linkLabel="View on Explorer" />}
        {transactionError && <TxStateCard tone="red" icon={<RedXIcon />} title="Failed" body={transactionError.message} />}
      </GateShell>
    </>
  );
}
