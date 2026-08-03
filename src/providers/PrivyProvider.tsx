'use client';

import React from 'react';
import { PrivyProvider as PrivyProviderWrapper } from '@privy-io/react-auth';
import { WagmiProvider } from 'wagmi';
import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { validateRpcEndpoint } from '@/lib/constants';

// Create wagmi config for Privy + Wagmi integration
const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  transports: {
    [baseSepolia.id]: http(
      process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://sepolia.base.org'
    ),
    [base.id]: http('https://mainnet.base.org'),
  },
});

interface PrivyProviderProps {
  children: React.ReactNode;
}

export function PrivyProvider({ children }: PrivyProviderProps) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  const rpcValid = validateRpcEndpoint();
  if (!rpcValid) {
    console.error('[PrivyProvider] ❌ RPC configuration invalid');
  }

  if (!privyAppId) {
    console.error('[PrivyProvider] ❌ Missing NEXT_PUBLIC_PRIVY_APP_ID');
    console.error('[PrivyProvider] Add it to .env.local');
    return <>{children}</>;
  }

  console.log('[PrivyProvider] ✅ Initializing with app ID:', privyAppId.substring(0, 10) + '...');

  return (
    <PrivyProviderWrapper
      appId={privyAppId}
      config={{
        loginMethods: ['google', 'email', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#00F0FF',
        },
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia, base],
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        {children}
      </WagmiProvider>
    </PrivyProviderWrapper>
  );
}
