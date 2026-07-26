'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { usePublicClient, useWalletClient } from 'wagmi';
import { encodeFunctionData } from 'viem';

/**
 * usePimlicTransaction: Handle gasless transactions via Pimlico paymaster
 * Automatically sponsors gas on Base Sepolia
 */
export function usePimlicTransaction() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendSponsoredTransaction = async ({
    contractAddress,
    abi,
    functionName,
    args,
    chainId,
  }: {
    contractAddress: string;
    abi: any[];
    functionName: string;
    args: any[];
    chainId: number;
  }) => {
    if (!address || !walletClient) {
      throw new Error('❌ Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      console.log('[usePimlicTransaction] Starting sponsored transaction:', {
        to: contractAddress,
        function: functionName,
        args,
      });

      // Encode the contract call
      const data = encodeFunctionData({
        abi,
        functionName,
        args,
      });

      console.log('[usePimlicTransaction] Encoded data:', data.substring(0, 50) + '...');

      // Send transaction via wallet client
      // Pimlico paymaster will automatically sponsor if configured
      const txHash = await walletClient.sendTransaction({
        account: address,
        to: contractAddress,
        data,
        value: 0n,
      });

      console.log('[usePimlicTransaction] ✅ Transaction sent:', txHash);

      // Wait for transaction confirmation
      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
          timeout: 60_000,
        });
        console.log('[usePimlicTransaction] ✅ Transaction confirmed');
      }

      return { txHash };
    } catch (err) {
      const errorMsg = (err as any).message || 'Unknown error';
      console.error('[usePimlicTransaction] ❌ Error:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendSponsoredTransaction,
    loading,
    error,
  };
}
