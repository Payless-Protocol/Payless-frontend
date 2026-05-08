"use client";

import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "00000000000000000000000000000000";
const baseRpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL ?? "https://mainnet.base.org";

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: "Payless Protocol",
      appLogoUrl: "https://paylessprotocol.xyz/logo.png",
      preference: "smartWalletOnly",
    }),
    walletConnect({
      projectId: walletConnectProjectId,
      showQrModal: true,
    }),
    injected(),
  ],
  transports: {
    [base.id]: http(baseRpcUrl),
    [baseSepolia.id]: http("https://sepolia.base.org"),
  },
  ssr: true,
});

export const config = wagmiConfig;
