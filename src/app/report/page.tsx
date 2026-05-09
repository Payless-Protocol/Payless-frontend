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
        boxShadow: "0 24px 60px rgba(0
