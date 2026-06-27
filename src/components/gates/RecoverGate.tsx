"use client";

import { useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom } from "viem";
import { baseSepolia } from "viem/chains";
import { getContractAddress, PAYLESS_ABI } from "@/lib/contract";
import { formatContractError } from "@/lib/contract";

export default function RecoverGate() {
  const { wallets } = useWallets();
  const [imei, setImei] = useState("");
  const [secretPhrase, setSecretPhrase] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUnflagDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imei || !secretPhrase) return;

    setLoading(true);
    setMessage("");

    try {
      const wallet = wallets[0];
      if (!wallet) throw new Error("Please connect your wallet first.");

      await wallet.switchChain(baseSepolia.id);
      
      const provider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: baseSepolia,
        transport: custom(provider),
      });

      const contractAddress = getContractAddress(baseSepolia.id);

      const { request } = await walletClient.simulateContract({
        address: contractAddress,
        abi: PAYLESS_ABI,
        functionName: "unflagDevice",
        args: [imei, secretPhrase],
      });

      const hash = await walletClient.writeContract(request);
      setMessage(`Device successfully unflagged! Tx Hash: ${hash}`);
    } catch (error: unknown) {
      setMessage(formatContractError(error, "Failed to clear device. Please verify credentials."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-neutral-900 rounded-xl shadow-md space-y-4 text-white">
      <h2 className="text-xl font-bold">Recover / Unflag Device</h2>
      <form onSubmit={handleUnflagDevice} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400">15-Digit IMEI</label>
          <input
            type="text"
            maxLength={15}
            value={imei}
            onChange={(e) => setImei(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white focus:outline-none focus:border-indigo-500"
            placeholder="Enter device IMEI"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400">Recovery Secret Phrase</label>
          <input
            type="password"
            value={secretPhrase}
            onChange={(e) => setSecretPhrase(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-sm text-white focus:outline-none focus:border-indigo-500"
            placeholder="Enter 3-word secret"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none disabled:opacity-50"
        >
          {loading ? "Processing..." : "Unflag Device"}
        </button>
      </form>
      {message && <p className="text-sm mt-2 text-neutral-300 break-words">{message}</p>}
    </div>
  );
}
