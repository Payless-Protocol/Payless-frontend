import { useState } from "react";

import { getFriendlyContractError, getWriteContract } from "@/lib/contract/hooks";
import { hashIMEI, hashSecret, isValidImei } from "@/lib/crypto/hash";

export function useFlagDevice() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  async function flagDevice(imei: string, secret: string) {
    const imeiValue = imei.trim();
    const secretValue = secret.trim();

    if (!isValidImei(imeiValue)) {
      throw new Error("Invalid device ID");
    }

    if (!secretValue) {
      throw new Error("Wrong secret key");
    }

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const contract = await getWriteContract();
      const tx = await contract.flagDevice(hashIMEI(imeiValue), hashSecret(secretValue));
      setTxHash(tx.hash);
      return tx.hash;
    } catch (cause) {
      const message = getFriendlyContractError(cause);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    flagDevice,
    isLoading,
    error,
    txHash,
  };
}
