"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { useState, type ReactNode } from "react";
import {
  BASE_MAINNET_RPC,
  BASE_SEPOLIA_RPC,
} from "@/lib/constants";

const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  ssr: true,
  transports: {
    [base.id]: http(BASE_MAINNET_RPC),
    [baseSepolia.id]: http(BASE_SEPOLIA_RPC),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#00F0FF",
          logo: "/logo.png",
        },
        loginMethods: ["google", "wallet"],
        defaultChain: baseSepolia,
        supportedChains: [base, baseSepolia],
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        // FIXED: Explicitly enable the smart wallet framework inside Privy context
        smartWallets: {
          enabled: true,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}

export default Web3Provider;
