"use client";

import { useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom, publicActions } from "viem";
import { baseSepolia } from "viem/chains";
import { getContractAddress, PAYLESS_ABI } from "@/lib/contract";
import { formatContractError } from "@/lib/contract";
import { hashIMEI, hashSecret } from "@/lib/hash";

export default function FlagGate() {
  const { wallets } = useWallets();
  const [imei, setImei] = useState("");
  // hashSecret() requires a 3-word tuple — must match the shape used
  // everywhere else in the app (lib/hash.ts: words.map(trim+toLowerCase).join(" "))
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

      // Switch to the target network
      await wallet.switchChain(baseSepolia.id);

      const provider = await wallet.getEthereumProvider();

      // ── Extend with publicActions ──────────────────────────────
      // createWalletClient() alone only exposes wallet actions
      // (writeContract, sendTransaction). simulateContract is a
      // public client action — .extend(publicActions) merges both
      // action sets onto one client object.
      const walletClient = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: baseSepolia,
        transport: custom(provider),
      }).extend(publicActions);

      const contractAddress = getContractAddress(baseSepolia.id);

      // ── Canonical hashing — must match lib/hash.ts exactly ──────
      // Do NOT hash inline here. Any drift from hashIMEI/hashSecret
      // (different normalization, encoding, or word-joining logic)
      // will make this device unrecoverable via RecoverGate, since
      // the contract compares hashes byte-for-byte.
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
    <div className="p-6 max-w-md mx-auto bg-neutral-900 rounded-xl shadow-md space-y-4 text-white">
      <h2 className="text-xl font-bold">Flag Trusted Device</h2>
      <form onSubmit={handleFlagDevice} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400">15-Digit IMEI</label>
          <input
            type="text"
            maxLength={15}
            value={imei}
            onChange={(e) => setImei(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            placeholder="Enter device IMEI"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400">
            Secret Recovery Phrase (3 words)
          </label>
          <p className="mt-1 text-xs text-neutral-500">
            Choose 3 words. Order matters — you'll need the exact same words and order to unflag later.
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <input
              type="text"
              value={word1}
              onChange={(e) => setWord1(e.target.value)}
              className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              placeholder="Word 1"
            />
            <input
              type="text"
              value={word2}
              onChange={(e) => setWord2(e.target.value)}
              className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              placeholder="Word 2"
            />
            <input
              type="text"
              value={word3}
              onChange={(e) => setWord3(e.target.value)}
              className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              placeholder="Word 3"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !imei || !wordsValid}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
        >
          {loading ? "Processing..." : "Flag Device"}
        </button>
      </form>
      {message && <p className="text-sm mt-2 text-neutral-300 break-words">{message}</p>}
    </div>
  );
}
