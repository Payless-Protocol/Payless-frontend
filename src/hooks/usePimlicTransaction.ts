'use client';

import { useState } from 'react';
import { useWallets, usePrivy } from '@privy-io/react-auth';
import { createSmartAccountClient } from 'permissionless';
import { toSimpleSmartAccount } from 'permissionless/accounts';
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import { http, createPublicClient, type Chain, type WalletClient, type Abi } from 'viem';
import { baseSepolia } from 'viem/chains';

/**
 * useGaslessTransaction: Handle gasless transactions via Coinbase paymaster
 * Uses Account Abstraction (ERC-4337) with permissionless v0.2.57
 */
export function useGaslessTransaction() {
  const { wallets } = useWallets();
  const { authenticated } = usePrivy();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendGaslessTransaction = async ({
    contractAddress,
    abi,
    functionName,
    args,
    chain = baseSepolia,
  }: {
    contractAddress: `0x${string}`;
    abi: Abi;
    functionName: string;
    args: any[];
    chain?: Chain;
  }) => {
    if (!authenticated) {
      throw new Error('❌ Please log in first');
    }

    // Find Privy embedded wallet
    const embeddedWallet = wallets.find(
      (wallet) => wallet.walletClientType === 'privy'
    );

    if (!embeddedWallet) {
      throw new Error('❌ No embedded wallet found. Please try logging in again.');
    }

    setLoading(true);
    setError(null);

    try {
      console.log('[useGaslessTransaction] Starting gasless transaction:', {
        to: contractAddress,
        function: functionName,
        args,
      });

      // Get the embedded wallet's provider
      const provider = await embeddedWallet.getEthereumProvider();

      // Create a viem wallet client from the Privy provider
      const { createWalletClient } = await import('viem');
      const { custom } = await import('viem');

      const walletClient = createWalletClient({
        account: embeddedWallet.address as `0x${string}`,
        chain,
        transport: custom(provider),
      }) as any;

      // Create public client for the chain
      const publicClient = createPublicClient({
        chain,
        transport: http(chain.rpcUrls.default.http[0]),
      });

      // Create smart account from the embedded wallet
      const smartAccount = await toSimpleSmartAccount({
        client: publicClient,
        owner: walletClient,
        entryPoint: {
          address: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789', // ERC-4337 EntryPoint v0.6
          version: '0.6',
        },
      });

      // Get Pimlico API key and construct bundler URL
      const pimlicoApiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;
      if (!pimlicoApiKey) {
        throw new Error('❌ NEXT_PUBLIC_PIMLICO_API_KEY not configured');
      }

      // Use Pimlico bundler URL for Base Sepolia (84532)
      const paymasterUrl = `https://api.pimlico.io/v2/84532/rpc?apikey=${pimlicoApiKey}`;

      // Create Pimlico client
      const pimlicoClient = createPimlicoClient({
        transport: http(paymasterUrl),
        entryPoint: {
          address: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
          version: '0.6',
        },
      });

      // Create smart account client with Pimlico bundler
      const smartAccountClient = createSmartAccountClient({
        account: smartAccount,
        chain,
        bundlerTransport: http(paymasterUrl),
        paymaster: pimlicoClient,
        userOperation: {
          estimateFeesPerGas: async () => {
            const gasPrice = await pimlicoClient.getUserOperationGasPrice();
            return gasPrice.fast; // { maxFeePerGas, maxPriorityFeePerGas }
          },
        },
      });

      console.log('[useGaslessTransaction] Sending UserOperation...');

      // Send gasless transaction
      const hash = await smartAccountClient.writeContract({
        address: contractAddress,
        abi,
        functionName,
        args,
      });

      console.log('[useGaslessTransaction] ✅ Transaction sent:', hash);

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
        timeout: 60_000,
      });

      console.log('[useGaslessTransaction] ✅ Transaction confirmed');

      return { txHash: hash, receipt };
    } catch (err) {
      const errorMsg = (err as any).message || 'Unknown error';
      console.error('[useGaslessTransaction] ❌ Error:', errorMsg);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendGaslessTransaction,
    loading,
    error,
  };
}
