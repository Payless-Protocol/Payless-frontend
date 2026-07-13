"use client";

import { useEffect, useState } from "react";
import { getReadContract } from "@/lib/contract";
import { hashIMEI } from "@/lib/hash";
import type { DeviceRecord } from "@/types";

const isValidIMEI = (value: string) => /^\d{15}$/.test(value.trim());

export function useDeviceStatus(imei: string) {
  const [status, setStatus] = useState<DeviceRecord["status"] | undefined>();
  const [updateAt, setUpdateAt] = useState<bigint | undefined>();
  const [secretHash, setSecretHash] = useState<DeviceRecord["secretHash"] | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!isValidIMEI(imei)) {
      setStatus(undefined);
      setUpdateAt(undefined);
      setSecretHash(undefined);
      setError(null);
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    setIsLoading(true);
    setError(null);

    void (async () => {
      try {
        const contract = getReadContract();
        const imeiHash = hashIMEI(imei);
        const record = (await contract.registry(imeiHash)) as DeviceRecord;

        if (!active) return;

        setStatus(Number(record.status) as DeviceRecord["status"]);
        setUpdateAt(record.updateAt);
        setSecretHash(record.secretHash);
      } catch (err) {
        if (!active) return;

        const message = err instanceof Error ? err.message : "Failed to load device status.";
        setError(message);
        setStatus(undefined);
        setUpdateAt(undefined);
        setSecretHash(undefined);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [imei]);

  return { status, updateAt, secretHash, isLoading, error };
}
