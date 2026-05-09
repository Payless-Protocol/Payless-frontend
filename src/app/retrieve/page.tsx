"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import {
  Button,
  CodeBlock,
  ConnectWalletCard,
  GateShell,
  MiniStepCard,
  Panel,
  Pill,
  Spinner,
  StatusCard,
  TextInput,
} from "@/components/gates/GateKit";
import { useAccount, useChainId, useConnect, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useCapabilities, useSendCalls, useCallsStatus } from "wagmi/experimental";
import { encodeFunctionData } from "viem";
import { hashIMEI, hashSecret } from "@/lib/hash";
import { PAYLESS_ABI, getContractAddress } from "@/lib/contract";
import { getTxUrl } from "@/lib/basescan";
import { TOKENS } from "@/styles/tokens";
import { paymasterConfig } from "@/lib/paymaster";

const isValidIMEI = (value: string) => /^\d{15}$/.test(value.trim());
const trimTxMessage = (message: string) => (message.length > 120 ? `${message.slice(0, 120)}...` : message);

const getRetrieveErrorMessage = (error: Error): string => {
  const msg = error.message.toLowerCase();
  if (msg.includes("unauthorized")) {
    return "Secret phrase does not match the original flag. Check your 3 words and their exact order.";
  }
  if (msg.includes("alreadyunflagged")) {
    return "This device is not currently flagged in the registry.";
  }
  if (msg.includes("invalidimei")) {
    return "The IMEI hash was rejected. Check your IMEI is exactly 15 digits.";
  }
  if (msg.includes("invalidsecret")) {
    return "The secret phrase was rejected. Ensure all 3 words are filled in correctly.";
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

export default function RetrievePage() {
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

  const canSubmit = isConnected && isValidIMEI(imei) && secretReady && !isPending && !isConfirming;
  const secretError = submitAttempted && !secretReady ? "Enter all 3 secret words." : null;
  const transactionError = manualError ? new Error(manualError) : (writeError ?? waitError ?? sendCallsError ?? (callsStatus?.status === "failure" ? new Error("Transaction failed") : null));
  
  const currentTxHash = txHash || callsStatus?.receipts?.[0]?.transactionHash;
  const txUrl = currentTxHash ? getTxUrl(currentTxHash as `0x${string}`, activeChainId) : "";

  const resetAll = () => {
    setImei("");
    setWords(["", "", ""]);
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

  const handleRetrieve = () => {
    setSubmitAttempted(true);
    setManualError(null);

    if (!/^\d{15}$/.test(imei.trim())) {
      setManualError("IMEI must be exactly 15 digits.");
      return;
    }
    if (words.some(w => !w.trim() || w.trim().length < 2)) {
      setManualError("Each secret word must be at least 2 characters.");
      return;
    }
    if (isPending || isConfirming) return;

    const imeiHash = hashIMEI(imei);
    const secretHash = hashSecret(words);

    const ZERO_HASH = "0x" + "0".repeat(64);
    if (imeiHash === ZERO_HASH || secretHash === ZERO_HASH) {
      setManualError("Hashing failed. Please refresh and try again.");
      return;
    }

    if (capabilities?.[activeChainId]?.paymasterService?.supported) {
      const calldata = encodeFunctionData({
        abi: PAYLESS_ABI,
        functionName: "unflagDevice",
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
        functionName: "unflagDevice",
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
          <Pill tone="green">🔓 Retrieve Gate</Pill>
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
            <span style={{ color: TOKENS.success }}>Retrieve</span> Your Device
          </h1>
          <div
            style={{
              maxWidth: 460,
              margin: "10px auto 0",
              color: TOKENS.body,
              fontSize: 15,
              lineHeight: 1.7,
            }}
          >
            Prove ownership using your secret phrase to remove the stolen flag from the registry.
          </div>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 36,
          }}
        >
          <MiniStepCard number="1" title="Enter IMEI" body="Type your 15-digit device IMEI" />
          <MiniStepCard number="2" title="Enter Secret" body="Provide your 3-word recovery phrase" />
          <MiniStepCard number="3" title="Unflag Device" body="Transaction removes the flag on-chain" />
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
              helper="Your IMEI is never sent to any server. It is hashed locally in your browser before the query."
              error={imeiError}
              maxLength={15}
              inputMode="numeric"
              disabled={isPending || isConfirming}
            />
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ marginBottom: 8, color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }}>
              Your Secret Recovery Phrase
            </div>
            <div style={{ color: TOKENS.muted, fontSize: 11, lineHeight: 1.5, marginBottom: 10 }}>
              Enter the exact 3 words you used when flagging this device. Order matters.
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" }}>
              {words.map((word, index) => (
                <input
                  key={`retrieve-word-${index}`}
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
            <div style={{ marginTop: 6, color: TOKENS.muted, fontSize: 11, lineHeight: 1.5 }}>
              Enter the exact 3 words you used when flagging this device. Order matters.
            </div>
            {hashPreview ? (
              <div style={{ marginTop: 14 }}>
                <div style={{ marginBottom: 8, color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 500 }}>
                  Secret hash
                </div>
                <CodeBlock>{hashPreview}</CodeBlock>
                <div style={{ marginTop: 6, color: TOKENS.muted, fontSize: 11, lineHeight: 1.5 }}>
                  This must match the hash stored on-chain when the device was flagged.
                </div>
              </div>
            ) : null}
          </div>

          <div style={{ marginTop: 24 }}>
            <Button fullWidth loading={isPending || isConfirming} disabled={!canSubmit} onClick={handleRetrieve} variant="success">
              {isPending ? "Submitting unflag request..." : isConfirming ? "Transaction submitted..." : "Unflag My Device"}
            </Button>
          </div>
        </Panel>

        {isPending ? (
          <TxStateCard tone="blue" icon={<BlueSpinner />} title="Submitting unflag request to Base..." body="Please confirm in your wallet." />
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
            title="Device Unflagged Successfully ✓"
            body="The stolen flag has been removed from the Base registry. This device will now appear clean in future searches."
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
                  Verify with Search
                </Link>
                <Button variant="outline" onClick={resetAll}>
                  Try Another Device
                </Button>
              </div>
            }
          />
        ) : null}

        {transactionError ? (
          <TxStateCard
            tone="red"
            icon={<RedXIcon />}
            title="Unflag Failed"
            body={getRetrieveErrorMessage(transactionError)}
            secondary="If this failed, it likely means the secret phrase does not match what was used when the device was originally flagged. Double-check the exact 3 words and their order."
            action={<Button variant="outline" onClick={resetErrorOnly}>Try Again</Button>}
          />
        ) : null}
      </GateShell>
    </>
  );
}
