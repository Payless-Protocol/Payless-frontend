"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { useAccount, useChainId } from "wagmi";
import { encodeFunctionData } from "viem";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/primitives/Button";
import { HashPreview } from "@/components/primitives/HashPreview";
import { Input } from "@/components/primitives/Input";
import { StepIndicator } from "@/components/primitives/StepIndicator";
import { TOKENS } from "@/styles/tokens";
import { PAYLESS_ABI } from "@/lib/abi";
import { ACTIVE_CHAIN_ID } from "@/lib/constants";
import { getTxUrl } from "@/lib/basescan";
import { getContractAddress } from "@/lib/contract";
import { useHashedPayload } from "@/hooks/useHashedPayload";

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

export function RecoverGate() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { login, authenticated } = usePrivy();

  const { client } = useSmartWallets();

  const [imei, setImei] = useState("");
  const [words, setWords] = useState<[string, string, string]>(["", "", ""]);
  const [touched, setTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);
  const [submittedHash, setSubmittedHash] = useState<`0x${string}` | undefined>();

  const [isPending, setIsPending] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const imeiError = useMemo(() => {
    if (!touched || imei.length === 0) return null;
    return isValidIMEI(imei) ? null : "IMEI must be exactly 15 digits.";
  }, [imei, touched]);

  const secretReady = words.every((word) => word.trim().length > 0);
  const payload = useHashedPayload(imei, words);

  const activeChainId = chainId || ACTIVE_CHAIN_ID;
  const currentTxHash = submittedHash;
  const txUrl = currentTxHash ? getTxUrl(currentTxHash, activeChainId) : "";

  const resetAll = () => {
    setImei("");
    setWords(["", "", ""]);
    setTouched(false);
    setSubmitAttempted(false);
    setSubmittedHash(undefined);
    setManualError(null);
    setIsPending(false);
    setIsConfirmed(false);
  };

  const resetErrorOnly = () => {
    setSubmittedHash(undefined);
    setManualError(null);
    setIsPending(false);
  };

  const canSubmit = isValidIMEI(imei) && secretReady && !isPending;
  const secretError = submitAttempted && !secretReady ? "Enter all 3 secret words." : null;
  const currentStep = !isValidIMEI(imei) ? 0 : !secretReady ? 1 : 2;

  const handleRecover = async () => {
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

    if (!address || !client || isPending) {
      return;
    }

    setIsPending(true);
    const contractAddr = getContractAddress(activeChainId);

    try {
      const calldata = encodeFunctionData({
        abi: PAYLESS_ABI,
        functionName: "unflagDevice",
        args: [payload.imeiHash, payload.secretHash],
      });

      // FIXED: Removed the inline type-breaking paymaster parameter
      const txHash = await client.sendTransaction({
        to: contractAddr,
        data: calldata,
        value: 0n,
      });

      setSubmittedHash(txHash as `0x${string}`);
      setIsConfirmed(true);
    } catch (err: any) {
      console.error("Smart wallet recovery failed:", err);
      setManualError(err?.message || "Sponsorship pipeline dropped. Check your dashboard configuration.");
    } finally {
      setIsPending(false);
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
              Recover
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
              <span style={{ color: TOKENS.success }}>Recover</span> Your Device
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
              Use the 3-word recovery phrase to remove the flag from the registry seamlessly.
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
                disabled={isPending}
              />
            </div>

            <div>
              <div style={{ marginBottom: 8, color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }}>
                Your Secret Recovery Phrase
              </div>
              <div style={{ color: TOKENS.muted, fontSize: 11, lineHeight: 1.5, marginBottom: 10 }}>
                Enter the exact 3 words you used when flagging this device. Order matters.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
                {words.map((word, index) => (
                  <Input
                    key={`recover-word-${index}`}
                    value={word}
                    disabled={isPending}
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
              <Button loading={isPending} disabled={!canSubmit} onClick={handleRecover}>
                {isPending ? "Submitting unflag request..." : "Unflag My Device"}
              </Button>
            </div>
          </div>

          {isPending ? (
            <TxStateCard
              tone="blue"
              icon={<BlueSpinner />}
              title="Submitting unflag request to Base..."
              body="Sponsoring transaction gas fees via Pimlico..."
            />
          ) : null}

          {isConfirmed && currentTxHash ? (
            <TxStateCard
              tone="green"
              icon={<GreenCheckIcon />}
              title="Device Unflagged Successfully"
              body="The flag has been removed from the registry."
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
                  <Button variant="secondary" onClick={resetAll} style={{ width: "auto" }}>
                    Try Another Device
                  </Button>
                </div>
              }
            />
          ) : null}

          {manualError ? (
            <TxStateCard
              tone="red"
              icon={<RedXIcon />}
              title="Unflag Failed"
              body={manualError}
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
