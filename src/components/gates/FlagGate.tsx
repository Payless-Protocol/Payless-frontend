"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
  useAccount,
  useChainId,
  useSwitchChain,
} from "wagmi";
import {
  useCallsStatus,
  useCapabilities,
  useSendCalls,
} from "wagmi/experimental";
import { encodeFunctionData } from "viem";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/primitives/Button";
import { HashPreview } from "@/components/primitives/HashPreview";
import { Input } from "@/components/primitives/Input";
import { StepIndicator } from "@/components/primitives/StepIndicator";
import { TOKENS } from "@/styles/tokens";
import { PAYLESS_ABI } from "@/lib/abi";
import { ACTIVE_CHAIN_ID, BASE_SEPOLIA_CHAIN_ID } from "@/lib/constants";
import { getTxUrl } from "@/lib/basescan";
import { getContractAddress } from "@/lib/contract";
import { useHashedPayload } from "@/hooks/useHashedPayload";
import { useFlagDevice } from "@/hooks/useFlagDevice";

const isValidIMEI = (value: string) => /^\d{15}$/.test(value.trim());

function TxStateCard({
  title,
  body,
  icon,
  link,
  linkLabel,
  tone = "blue",
  action,
}: {
  title: string;
  body: string;
  icon: ReactNode;
  link?: string;
  linkLabel?: string;
  tone?: "blue" | "green" | "red";
  action?: ReactNode;
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
        boxShadow: "0 14px 32px rgba(0,0,0,0.14)",
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
          {link && linkLabel ? (
            <div style={{ marginTop: 14 }}>
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: TOKENS.accent,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 600,
                }}
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

function GreenCheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke={TOKENS.success} strokeWidth="2" />
      <path
        d="m7 12.5 3 3 7-7"
        stroke={TOKENS.success}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RedXIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke={TOKENS.danger} strokeWidth="2" />
      <path
        d="m8 8 8 8"
        stroke={TOKENS.danger}
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <path
        d="m16 8-8 8"
        stroke={TOKENS.danger}
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BlueSpinner() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ animation: "gate-spin 0.85s linear infinite" }}
    >
      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.22)" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

const steps = ["IMEI", "Secret phrase", "Submit"];

export function FlagGate() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { login, authenticated } = usePrivy();
  const { switchChainAsync } = useSwitchChain();
  const { data: capabilities } = useCapabilities();
  const {
    sendCalls,
    data: callsIdData,
    isPending: isSendCallsPending,
    error: sendCallsError,
    reset: resetSendCalls,
  } = useSendCalls();
  const actualCallsId = typeof callsIdData === "string" ? callsIdData : (callsIdData as any)?.id;
  const { data: callsStatus } = useCallsStatus({
    id: actualCallsId as string,
    query: { enabled: !!actualCallsId },
  });
  const { flag, isLoading: isLocalLoading, isSuccess: isLocalSuccess, error: localError, txHash: localTxHash } =
    useFlagDevice();

  const [imei, setImei] = useState("");
  const [words, setWords] = useState<[string, string, string]>(["", "", ""]);
  const [confirmed, setConfirmed] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);
  const [submittedHash, setSubmittedHash] = useState<`0x${string}` | undefined>();

  const imeiError = useMemo(() => {
    if (!touched || imei.length === 0) return null;
    return isValidIMEI(imei) ? null : "IMEI must be exactly 15 digits.";
  }, [imei, touched]);

  const secretReady = words.every((word) => word.trim().length > 0);
  const payload = useHashedPayload(imei, words);

  useEffect(() => {
    if (localTxHash) {
      setSubmittedHash(localTxHash);
    }
  }, [localTxHash]);

  const activeChainId = chainId || ACTIVE_CHAIN_ID;
  const isPaymasterSupported = Boolean(capabilities?.[activeChainId]?.paymasterService?.supported);
  const isPaymasterPending = isSendCallsPending;
  const isPaymasterConfirming = !!actualCallsId && callsStatus?.status === "pending";
  const isPaymasterConfirmed = callsStatus?.status === "success";

  const isPending = isPaymasterPending || (isLocalLoading && !localTxHash);
  const isConfirming =
    isPaymasterConfirming || (isLocalLoading && !!localTxHash && !isLocalSuccess);
  const isConfirmed = isPaymasterConfirmed || isLocalSuccess;

  const currentTxHash =
    (typeof callsStatus?.receipts?.[0]?.transactionHash === "string"
      ? (callsStatus.receipts[0].transactionHash as `0x${string}`)
      : undefined) ?? submittedHash;

  const txUrl = currentTxHash
    ? getTxUrl(currentTxHash, activeChainId)
    : "";

  const resetForm = () => {
    setImei("");
    setWords(["", "", ""]);
    setConfirmed(false);
    setTouched(false);
    setSubmitAttempted(false);
    setSubmittedHash(undefined);
    setManualError(null);
    resetSendCalls();
  };

  const resetErrorOnly = () => {
    resetSendCalls();
    setSubmittedHash(undefined);
    setManualError(null);
  };

  const canSubmit = isValidIMEI(imei) && secretReady && confirmed && !isPending && !isConfirming;
  const secretError = submitAttempted && !secretReady ? "Enter all 3 secret words." : null;
  const confirmationError = submitAttempted && !confirmed ? "Please confirm this is your device before submitting." : null;
  const transactionErrorMessage =
    manualError ||
    (sendCallsError instanceof Error
      ? sendCallsError.message
      : sendCallsError
        ? String(sendCallsError)
        : "") ||
    localError ||
    "Transaction failed. Please try again.";
  const currentStep = !isValidIMEI(imei) ? 0 : !secretReady ? 1 : 2;

  const handleFlag = async () => {
    setSubmitAttempted(true);
    setManualError(null);

    if (!authenticated) {
      login();
      setManualError("Please connect your wallet or log in first.");
      return;
    }

    if (!isValidIMEI(imei)) {
      setManualError("IMEI must be exactly 15 digits.");
      return;
    }

    if (words.some((word) => !word.trim() || word.trim().length < 2)) {
      setManualError("Each secret word must be at least 2 characters.");
      return;
    }

    if (!confirmed || !address || isPending || isConfirming) {
      return;
    }

    const contractAddr = getContractAddress(activeChainId);
    const imeiHash = payload.imeiHash;
    const secretHash = payload.secretHash;

    let txSuccess = false;
    try {
      const calldata = encodeFunctionData({
        abi: PAYLESS_ABI,
        functionName: "flagDevice",
        args: [imeiHash, secretHash],
      });

      if (isPaymasterSupported) {
        await sendCalls({
          account: address,
          calls: [{ to: contractAddr, data: calldata, value: 0n }],
          capabilities: { paymasterService: { url: process.env.NEXT_PUBLIC_PAYMASTER_URL! } },
        });
        txSuccess = true;
      }
    } catch (sponsoredErr) {
      console.warn("Paymaster failed, trying standard tx...", sponsoredErr);
    }

    if (!txSuccess) {
      try {
        try {
          await switchChainAsync({ chainId: BASE_SEPOLIA_CHAIN_ID });
        } catch (switchErr) {
          console.warn("Chain switch failed:", switchErr);
        }

        await flag(imei.trim(), words);
      } catch {
        // The hook already formats and stores the error for the UI.
      }
    }
  };

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
              Flag
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
              Flag <span style={{ color: TOKENS.danger }}>Lost or Stolen</span> Device
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
              Write the IMEI hash to the registry from a connected wallet so others can see the flag.
            </div>
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: 560,
              marginBottom: 18,
            }}
          >
            <StepIndicator steps={steps} currentStep={currentStep} />
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
            This action writes to the registry and cannot be undone. Make sure the IMEI and secret phrase are correct.
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: 560,
              background: TOKENS.surface,
              border: `1px solid ${TOKENS.borderSubtle}`,
              borderRadius: TOKENS.cardRadius,
              padding: 32,
              boxShadow: "0 14px 32px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <div>
              <div style={{ marginBottom: 8, color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }}>
                IMEI Number
              </div>
              <Input
                value={imei}
                onChange={(value) => {
                  setImei(value.replace(/\D/g, "").slice(0, 15));
                  setTouched(true);
                }}
                placeholder="Enter 15-digit IMEI"
                error={imeiError}
                disabled={isPending || isConfirming}
              />
            </div>

            <div>
              <div style={{ marginBottom: 8, color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }}>
                Secret Recovery Phrase (3 words)
              </div>
              <div style={{ color: TOKENS.muted, fontSize: 11, lineHeight: 1.5, marginBottom: 10 }}>
                Choose 3 unique words. This is your recovery key to unflag the device later.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
                {words.map((word, index) => (
                  <Input
                    key={`word-${index}`}
                    value={word}
                    disabled={isPending || isConfirming}
                    onChange={(value) => {
                      const sanitized = value.toLowerCase().replace(/[^a-z]/g, "");
                      setWords((current) =>
                        current.map((item, itemIndex) => (itemIndex === index ? sanitized : item)) as [
                          string,
                          string,
                          string,
                        ]
                      );
                    }}
                    placeholder={`Word ${index + 1}`}
                  />
                ))}
              </div>
              {secretError ? <div style={{ marginTop: 8, color: TOKENS.danger, fontSize: 12 }}>{secretError}</div> : null}
              {secretReady && payload.secretHash ? (
                <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
                  <div style={{ marginBottom: 0, color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 500 }}>
                    Secret hash preview
                  </div>
                  <HashPreview hash={payload.secretHash} />
                </div>
              ) : null}
            </div>

            <div>
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
                <div style={{ marginTop: 8, color: TOKENS.danger, fontSize: 12 }}>
                  {confirmationError}
                </div>
              ) : null}
            </div>

            <Button loading={isPending || isConfirming} disabled={!canSubmit} onClick={handleFlag}>
              Flag Device on Base
            </Button>
          </div>

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
            />
          ) : null}

          {isConfirmed && currentTxHash ? (
            <TxStateCard
              tone="green"
              icon={<GreenCheckIcon />}
              title="Device Flagged Successfully"
              body="Your IMEI has been registered in the registry."
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
                  <Button variant="secondary" onClick={resetForm} style={{ width: "auto" }}>
                    Flag Another Device
                  </Button>
                </div>
              }
            />
          ) : null}

          {transactionErrorMessage ? (
            <TxStateCard
              tone="red"
              icon={<RedXIcon />}
              title="Transaction Failed"
              body={transactionErrorMessage}
              action={
                <Button variant="secondary" onClick={resetErrorOnly} style={{ width: "auto" }}>
                  Try Again
                </Button>
              }
            />
          ) : null}
        </div>
      </main>
    </>
  );
}
