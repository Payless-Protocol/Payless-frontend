"use client";

import { useEffect, useState } from "react";

import { getWalletProvider, shortAddress } from "@/lib/contract/hooks";

type WalletEthereum = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function syncAccount() {
      try {
        const provider = await getWalletProvider();
        const accounts = (await provider.send("eth_accounts", [])) as string[];
        if (!mounted) return;
        setAddress(accounts[0] ?? null);
      } catch {
        if (mounted) setAddress(null);
      }
    }

    syncAccount();

    const ethereum = typeof window === "undefined" ? null : (window as Window & { ethereum?: WalletEthereum }).ethereum;

    if (ethereum?.on) {
      const handler = (...args: unknown[]) => {
        const accounts = (args[0] as string[] | undefined) ?? [];
        setAddress(accounts[0] ?? null);
      };
      ethereum.on("accountsChanged", handler);
      return () => {
        mounted = false;
        ethereum.removeListener?.("accountsChanged", handler);
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  async function connect() {
    setIsConnecting(true);
    setError(null);

    try {
      const provider = await getWalletProvider();
      const accounts = (await provider.send("eth_requestAccounts", [])) as string[];
      const nextAddress = accounts[0] ?? null;
      setAddress(nextAddress);
      return nextAddress;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Wallet connection failed";
      setError(message);
      throw new Error(message);
    } finally {
      setIsConnecting(false);
    }
  }

  function disconnect() {
    setAddress(null);
  }

  return {
    address,
    shortAddress: address ? shortAddress(address) : null,
    isConnecting,
    error,
    isConnected: Boolean(address),
    connect,
    disconnect,
  };
}
