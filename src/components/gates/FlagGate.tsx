"use client";

import { useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom, publicActions } from "viem";
import { getContractAddress, PAYLESS_ABI } from "@/lib/contract";
import { formatContractError } from "@/lib/contract";
import { hashIMEI, hashSecret } from "@/lib/hash";
import { ACTIVE_CHAIN_ID, getActiveChain } from "@/lib/constants";

export default function FlagGate() {
  const { wallets } = useWallets();
  const [imei, setImei] = useState("");
  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  const [word3, setWord3] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const wordsValid = [word1, word2, word3].every((w) => w.trim().length >= 2);

  const handleFlagDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imei || !wordsValid) return;

    setLoading(true);
    setMessage("");

    try {
      const wallet = wallets[0];
      if (!wallet) throw new Error("Please connect your wallet first.");

      // ── Driven by env config, not hardcoded ─────────────────────
      // ACTIVE_CHAIN_ID / getActiveChain() come from lib/constants.ts.
      // Switching networks later is a single env var change —
      // never edit this component to change chains.
      const chain = getActiveChain();
      await wallet.switchChain(ACTIVE_CHAIN_ID);

      const provider = await wallet.getEthereumProvider();

      const walletClient = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain,
        transport: custom(provider),
      }).extend(publicActions);

      const contractAddress = getContractAddress(ACTIVE_CHAIN_ID);

      // ── Canonical hashing — must match lib/hash.ts exactly ──────
      const imeiHash   = hashIMEI(imei.trim());
      const secretHash = hashSecret([word1, word2, word3]);

      const { request } = await walletClient.simulateContract({
        address: contractAddress,
        abi: PAYLESS_ABI,
        functionName: "flagDevice",
        args: [imeiHash, secretHash],
        account: wallet.address as `0x${string}`,
      });

      const hash = await walletClient.writeContract(request);
      setMessage(`Device successfully flagged! Tx Hash: ${hash}`);
    } catch (error: unknown) {
      setMessage(formatContractError(error, "Failed to flag device. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-neutral-900 border border-neutral-700 rounded-xl shadow-md space-y-4 text-white">
      <h2 className="text-xl font-bold">Flag Trusted Device</h2>
      <form onSubmit={handleFlagDevice} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">15-Digit IMEI</label>
          <input
            type="text"
            maxLength={15}
            value={imei}
            onChange={(e) => setImei(e.target.value)}
            className="mt-1 block w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            placeholder="Enter device IMEI"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Secret Recovery Phrase (3 words)
          </label>
          <p className="mt-1 text-xs text-neutral-500">
            Choose 3 words. Order matters — you&apos;ll need the exact same words and order to unflag later.
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <input
              type="text"
              value={word1}
              onChange={(e) => setWord1(e.target.value)}
              className="px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              placeholder="Word 1"
            />
            <input
              type="text"
              value={word2}
              onChange={(e) => setWord2(e.target.value)}
              className="px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              placeholder="Word 2"
            />
            <input
              type="text"
              value={word3}
              onChange={(e) => setWord3(e.target.value)}
              className="px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              placeholder="Word 3"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !imei || !wordsValid}
          className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-red-500 hover:bg-red-600 focus:outline-none disabled:opacity-50"
        >
          {loading ? "Processing..." : "Flag Device"}
        </button>
      </form>
      {message && <p className="text-sm mt-2 text-neutral-300 break-words">{message}</p>}
    </div>
  );
}
