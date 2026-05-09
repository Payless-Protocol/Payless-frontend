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
import { PAYLESS_ABI, getContractAddress } from "@/lib/contract";
import { getTxUrl } from "@/lib/basescan";
import { TOKENS } from "@/styles/tokens";

const isValidIMEI = (value: string) => /^\d{15}$/.test(value.trim());

const getReportErrorMessage = (error: Error): string => {
  const msg = error.message.toLowerCase();
  if (msg.includes("invalidimei")) {
    return "The IMEI hash was rejected. Ensure your IMEI is exactly 15 digits.";
  }
  if (msg.includes("invalidsecret")) {
    return "The secret phrase was rejected. Ensure all 3 words are filled in.";
  }
  if (msg.includes("user rejected") || msg.includes("rejected the request")) {
    return "Transaction was cancelled in your wallet.";
  }
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
  const palette =
    tone === "green"
      ? {
          border: "rgba(34,197,94,0.3)",
          background: "rgba(34,197,94,0.06)",
          title: TOKENS.success,
        }
      : tone === "red"
      ? {
          border: "rgba(239,68,68,0.3)",
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
        marginTop: 24,
        width: "100%",
        maxWidth: 560,
        borderRadius: 16,
        border: `1px solid ${palette.border}`,
        background: palette.background,
        padding: 28,
        boxShadow: "0 24px 60px rgba(0,0,0,0.24)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ flex: "0 0 auto" }}>{icon}</div>
        <div style={{ flex: "1 1 auto" }}>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              color: palette.title,
              fontSize: 20,
              fontWeight: 800,
              marginBottom: 8,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          <div style={{ color: TOKENS.body, fontSize: 14, lineHeight: 1.7 }}>{body}</div>
          {secondary ? <div style={{ marginTop: 12, color: "rgba(255,255,255,0.72)", fontSize: 13 }}>{secondary}</div> : null}
          {link && linkLabel ? (
            <div style={{ marginTop: 14 }}>
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                style={{ color: TOKENS.accent, textDecoration: "none", fontSize: 13, fontWeight: 600 }}
              >
                {linkLabel}
              </a>
            </div>
          ) : null}
          {action ? <div style={{ marginTop: 18 }}>{action}</div> : null}
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
  const { isLoading: isWaitConfirming, isSuccess: isWaitConfirmed, error: waitError } = useWaitForTransactionReceipt({
    hash: submittedHash,
  });

  const { data: capabilities } = useCapabilities();
  const { sendCalls, data: callsIdData, isPending: isSendCallsPending, error: sendCallsError, reset: resetSendCalls } = useSendCalls();
  const actualCallsId = typeof callsIdData === "string" ? callsIdData : (callsIdData as any)?.id;
  const { data: callsStatus } = useCallsStatus({
    id: actualCallsId as string,
    query: { enabled: !!actualCallsId },
  });

  const [imei, setImei] = useState("");
  const [words, setWords] = useState(["", "", ""]);
  const [confirmed, setConfirmed] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [hashPreview, setHashPreview] = useState("");
  const [manualError, setManualError] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const activeChainId = chainId || 84532;
  const imeiError = useMemo(() => {
    if (!touched || imei.length === 0) return null;
    return isValidIMEI(imei) ? null : "Invalid device ID";
  }, [imei, touched]);

  const secretReady = words.every((word) => word.trim().length > 0);

  useEffect(() => {
    if (secretReady) {
      const preview = hashSecret(words);
      setHashPreview(`${preview.slice(0, 20)}...`);
      return;
    }
    setHashPreview("");
  }, [secretReady, words]);

  useEffect(() => {
    if (submittedHash) return;
    if (typeof txHash === "string") {
      setSubmittedHash(txHash as `0x${string}`);
    }
  }, [submittedHash, txHash]);

  const isPending = isWritePending || isSendCallsPending;
  const isConfirming = isWaitConfirming || (!!actualCallsId && callsStatus?.status === "pending");
  const isConfirmed = isWaitConfirmed || callsStatus?.status === "success";

  const canSubmit =
    isConnected &&
    isValidIMEI(imei) &&
    secretReady &&
    confirmed &&
    !isPending &&
    !isConfirming;

  const secretError = submitAttempted && !secretReady ? "Enter all 3 secret words." : null;
  const confirmationError = submitAttempted && !confirmed ? "Please confirm this is your device before submitting." : null;
  const transactionError = manualError ? new Error(manualError) : (writeError ?? waitError ?? sendCallsError ?? (callsStatus?.status === "failure" ? new Error("Transaction failed") : null));
  
  const currentTxHash = txHash || callsStatus?.receipts?.[0]?.transactionHash;
  const txUrl = currentTxHash ? getTxUrl(currentTxHash as `0x${string}`, activeChainId) : "";

  const resetForm = () => {
    setImei("");
    setWords(["", "", ""]);
    setConfirmed(false);
    setTouched(false);
    setSubmitAttempted(false);
    setHashPreview("");
    setSubmittedHash(undefined);
    setManualError(null);
    resetWrite();
    resetSendCalls();
  };

  const resetErrorOnly = () => {
    resetWrite();
    resetSendCalls();
    setSubmittedHash(undefined);
    setManualError(null);
  };

  const handleConnect = async () => {
    const connector = connectors[0];
    if (!connector) return;
    await connectAsync({ connector });
  };

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
    if (!confirmed) return;
    if (isPending || isConfirming) return;

    // HASHING LOGIC: Matching the contract's expected bytes32
    const imeiHash = hashIMEI(imei.trim());
    const secretHash = hashSecret(words);

    if (capabilities?.[activeChainId]?.paymasterService?.supported) {
      const calldata = encodeFunctionData({
        abi: PAYLESS_ABI,
        functionName: "flagDevice",
        args: [imeiHash, secretHash],
      });

      sendCalls({
        calls: [{
          to: getContractAddress(activeChainId),
          data: calldata,
        }],
        capabilities: {
          paymasterService: {
            url: process.env.NEXT_PUBLIC_PAYMASTER_URL!,
          },
        },
      });
    } else {
      writeContract({
        address: getContractAddress(activeChainId),
        abi: PAYLESS_ABI,
        functionName: "flagDevice",
        args: [imeiHash, secretHash],
      });
    }
  };

  if (!isConnected) {
    return (
      <>
        <Navbar />
        <GateShell maxWidth={760}>
          <ConnectWalletCard onConnect={handleConnect} isConnecting={isWalletConnecting} address={address} />
        </GateShell>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <GateShell maxWidth={760}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Pill tone="red"> Report Gate</Pill>
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
            Report <span style={{ color: TOKENS.danger }}>Lost or Stolen</span> Device
          </h1>
          <div
            style={{
              maxWidth: 480,
              margin: "10px auto 0",
              color: TOKENS.body,
              fontSize: 15,
              lineHeight: 1.7,
            }}
          >
            Flag your device IMEI on-chain. Once flagged, any buyer can instantly see it has been reported.
          </div>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 560,
            marginBottom: 24,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 12,
            padding: "14px 20px",
            color: "rgba(255,255,255,0.65)",
            fontSize: 13,
            lineHeight: 1.65,
          }}
        >
           This action writes to the Base blockchain and cannot be undone. Make sure your IMEI and secret phrase are
          correct.
        </div>

        <Panel style={{ maxWidth: 560 }}>
          <div>
            <div style={{ marginBottom: 8, color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }}>
              IMEI Number
            </div>
            <TextInput
              value={imei}
              onChange={(value) => {
                setImei(value.replace(/\D/g, "").slice(0, 15));
                setTouched(true);
              }}
              placeholder="Enter 15-digit IMEI (e.g. 352099001761481)"
              helper="Your IMEI is never sent to any server. It is hashed locally in your browser."
              error={imeiError}
              maxLength={15}
              inputMode="numeric"
              disabled={isPending || isConfirming}
            />
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ marginBottom: 8, color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }}>
              Secret Recovery Phrase (3 words)
            </div>
            <div style={{ color: TOKENS.muted, fontSize: 11, lineHeight: 1.5, marginBottom: 10 }}>
              Choose 3 unique words. This is your recovery key to unflag the device later.
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" }}>
              {words.map((word, index) => (
                <input
                  key={`word-${index}`}
                  value={word}
                  disabled={isPending || isConfirming}
                  onChange={(event) => {
                    const sanitized = event.target.value.toLowerCase().replace(/[^a-z]/g, "");
                    setWords((current) => current.map((item, itemIndex) => (itemIndex === index ? sanitized : item)));
                  }}
                  placeholder={`Word ${index + 1}`}
                  style={{
                    flex: "1 1 140px",
                    minWidth: 0,
                    background: TOKENS.inputBackground,
                    border: `1px solid ${TOKENS.inputBorder}`,
                    borderRadius: TOKENS.buttonRadius,
                    padding: "13px 14px",
                    color: TOKENS.heading,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    outline: "none",
                    opacity: isPending || isConfirming ? 0.65 : 1,
                    cursor: isPending || isConfirming ? "not-allowed" : "text",
                  }}
                />
              ))}
            </div>
            {secretError ? <div style={{ marginTop: 8, color: TOKENS.danger, fontSize: 12 }}>{secretError}</div> : null}
            {hashPreview ? (
              <div style={{ marginTop: 14 }}>
                <div style={{ marginBottom: 8, color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 500 }}>
                  Secret Hash Preview (what gets stored on-chain)
                </div>
                <CodeBlock>{hashPreview}</CodeBlock>
                <div style={{ marginTop: 6, color: TOKENS.muted, fontSize: 11, lineHeight: 1.5 }}>
                  Your actual words are never stored or transmitted.
                </div>
              </div>
            ) : null}
          </div>

          <div style={{ marginTop: 22 }}>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                color: "rgba(255,255,255,0.6)",
                fontSize: 13,
                lineHeight: 1.6,
                cursor: isPending || isConfirming ? "not-allowed" : "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={confirmed}
                disabled={isPending || isConfirming}
                onChange={(event) => setConfirmed(event.target.checked)}
                style={{ marginTop: 3 }}
              />
              <span>I confirm this is my device and I am flagging it as lost or stolen.</span>
            </label>
            {confirmationError ? (
              <div style={{ marginTop: 8, color: TOKENS.danger, fontSize: 12 }}>{confirmationError}</div>
            ) : null}
          </div>

          <div style={{ marginTop: 24 }}>
            <Button fullWidth loading={isPending || isConfirming} disabled={!canSubmit} onClick={handleFlag} variant="danger">
              {isPending ? "Submitting to Base..." : isConfirming ? "Transaction submitted..." : "Flag Device on Base"}
            </Button>
          </div>
        </Panel>

        {isPending ? (
          <TxStateCard
            tone="blue"
            icon={<BlueSpinner />}
            title="Submitting to Base..."
            body="Please confirm in your wallet."
          />
        ) : null}

        {isConfirming ? (
          <TxStateCard
            tone="blue"
            icon={<BlueSpinner />}
            title="Transaction submitted. Waiting for confirmation..."
            body="This usually takes a few seconds on Base."
            link={txUrl}
            linkLabel={currentTxHash ? `${currentTxHash.slice(0, 8)}...${currentTxHash.slice(-6)}` : undefined}
            secondary="Base Sepolia"
          />
        ) : null}

        {isConfirmed && currentTxHash ? (
          <TxStateCard
            tone="green"
            icon={<GreenCheckIcon />}
            title="Device Flagged Successfully ✓"
            body="Your IMEI has been registered on the Base blockchain."
            link={txUrl}
            linkLabel={`Transaction: ${currentTxHash.slice(0, 8)}...${currentTxHash.slice(-6)}`}
            action={
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link
                  href="/search"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 16px",
                    borderRadius: 10,
                    background: "transparent",
                    border: "1px solid rgba(34,197,94,0.28)",
                    color: TOKENS.heading,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Search This IMEI
                </Link>
                <Button variant="outline" onClick={resetForm}>
                  Flag Another Device
                </Button>
              </div>
            }
          />
        ) : null}

        {transactionError ? (
          <TxStateCard
            tone="red"
            icon={<RedXIcon />}
            title="Transaction Failed"
            body={getReportErrorMessage(transactionError)}
            secondary="This may happen if the device is already flagged, or if your wallet rejected the transaction."
            action={<Button variant="outline" onClick={resetErrorOnly}>Try Again</Button>}
          />
        ) : null}
      </GateShell>
    </>
  );
}
