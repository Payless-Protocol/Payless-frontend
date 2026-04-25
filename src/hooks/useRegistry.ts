import { useState } from "react";

import { getFriendlyContractError, getReadContract } from "@/lib/contract/hooks";
import { hashIMEI, isValidImei } from "@/lib/crypto/hash";
import type { DeviceRecord, DeviceStatus } from "@/types";

type RawRegistryValue = {
  flagged?: unknown;
  status?: unknown;
  isFlagged?: unknown;
  reporter?: unknown;
  notes?: unknown;
  updatedAt?: unknown;
  lastUpdated?: unknown;
  reportedAt?: unknown;
  timestamp?: unknown;
  [key: string]: unknown;
  [index: number]: unknown;
};

function inferStatus(value: unknown): DeviceStatus {
  if (typeof value === "boolean") {
    return value ? "flagged" : "clean";
  }

  if (typeof value === "number" || typeof value === "bigint") {
    return Number(value) === 0 ? "clean" : "flagged";
  }

  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized.includes("flag")) return "flagged";
    if (normalized.includes("clean")) return "clean";
  }

  return "clean";
}

function toStringValue(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "bigint") return value.toString();
  return undefined;
}

function normalizeRecord(imeiHash: `0x${string}`, value: unknown): DeviceRecord {
  const record = value as RawRegistryValue;
  const statusValue = record?.status ?? record?.flagged ?? record?.isFlagged ?? record?.[0];
  const reporterValue = record?.reporter ?? record?.[1];
  const notesValue = record?.notes ?? record?.[2];
  const timeValue = record?.updatedAt ?? record?.lastUpdated ?? record?.reportedAt ?? record?.timestamp ?? record?.[3];

  return {
    imeiHash,
    status: inferStatus(statusValue),
    reporter: toStringValue(reporterValue),
    notes: toStringValue(notesValue),
    lastUpdated: toStringValue(timeValue),
  };
}

export function useRegistry() {
  const [record, setRecord] = useState<DeviceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(imei: string) {
    const normalized = imei.trim();
    if (!isValidImei(normalized)) {
      throw new Error("Invalid device ID");
    }

    setIsLoading(true);
    setError(null);

    try {
      const imeiHash = hashIMEI(normalized);
      const contract = getReadContract();
      const result = await contract.registry(imeiHash);
      const nextRecord = normalizeRecord(imeiHash, result);
      setRecord(nextRecord);
      return nextRecord;
    } catch (cause) {
      const message = getFriendlyContractError(cause);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    setRecord(null);
    setError(null);
  }

  return {
    record,
    isLoading,
    error,
    search,
    reset,
  };
}
