"use client";

import { useState } from "react";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import { createWalletClient, custom, publicActions } from "viem";
import { getContractAddress, PAYLESS_ABI } from "@/lib/contract";
import { formatContractError } from "@/lib/contract";
import { hashIMEI, hashSecret, validateIMEI, validateWord } from "@/lib/hash";
import { ACTIVE_CHAIN_ID, getActiveChain } from "@/lib/constants";

export default function RecoverGate() {
  const { wallets } = useWallets();
  const { authenticated } = usePrivy();
  const [imei, setImei] = useState("");
  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  const [word3, setWord3] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const wordsValid = [word1, word2, word3].every((w) => w.trim().length >= 2);

  if (!authenticated) {
    return (
      <div className="p-6 max-w-md mx-auto bg-neutral-900 rounded-xl shadow-md space-y-4 text-white border border-neutral-700">
        <h2 className="text-xl font-bold">Recover Device</h2>
        <p className="text-sm text-neutral-400">
          Please log in first to recover a device.
        </p>
      </div>
    );
  }

  const handleUnflagDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imei || !wordsValid) return;

    // Validate IMEI format
    if (!validateIMEI(imei)) {
      setMessage('❌ IMEI must be exactly 15 digits (no spaces or dashes).');
      setLoading(false);
      return;
    }

    // Validate words format
    const words = [word1, word2, word3];
    if (!words.every(validateWord)) {
      setMessage('❌ Each word must be 2+ letters (no numbers or special characters).');
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const wallet = wallets[0];
      if (!wallet) throw new Error("Please connect your wallet first.");

      const chain = getActiveChain();
      
      // Validate chain ID
      if (ACTIVE_CHAIN_ID !== 84532 && ACTIVE_CHAIN_ID !== 8453) {
        throw new Error(`Invalid chain ID: ${ACTIVE_CHAIN_ID}. Expected Base Sepolia (84532) or Base (8453).`);
      }
      
      await wallet.switchChain(ACTIVE_CHAIN_ID);

      const provider = await wallet.getEthereumProvider();

      const walletClient = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain,
        transport: custom(provider),
      }).extend(publicActions);

      const contractAddress = getContractAddress(ACTIVE_CHAIN_ID);

      const imeiHash = hashIMEI(imei.trim());
      const secretHash = hashSecret([word1, word2, word3]);

      const { request } = await walletClient.simulateContract({
        address: contractAddress,
        abi: PAYLESS_ABI,
        functionName: "unflagDevice",
        args: [imeiHash, secretHash],
        account: wallet.address as `0x${string}`,
      });

      const hash = await walletClient.writeContract(request);

      // Verify receipt before showing success
      try {
        const receipt = await walletClient.getTransactionReceipt({ hash });
        if (receipt.status === 'reverted') {
          throw new Error('Transaction reverted on-chain');
        }
        setMessage(`✅ Device successfully unflagged! Tx Hash: ${hash}`);

        // Clear form state after successful transaction
        setTimeout(() => {
          setImei('');
          setWord1('');
          setWord2('');
          setWord3('');
        }, 2000); // Show success message for 2 seconds before clearing
      } catch (receiptError) {
        throw new Error(`Transaction may have failed. Hash: ${hash}. Error: ${(receiptError as any).message}`);
      }
    } catch (error: unknown) {
      setMessage(formatContractError(error, "Failed to clear device. Please verify credentials."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-neutral-900 rounded-xl shadow-md space-y-4 text-white border border-neutral-700">
      <h2 className="text-xl font-bold">Recover / Unflag Device</h2>
      <form onSubmit={handleUnflagDevice} className="space-y-4">
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
            Enter the exact 3 words you used when flagging this device. Order matters.
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
          className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none disabled:opacity-50"
        >
          {loading ? "Processing..." : " Recover Device"}
        </button>
      </form>
      {message && <p className="text-sm mt-2 text-neutral-300 break-words">{message}</p>}
    </div>
  );
}
