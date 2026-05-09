import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { 
  coinbaseWallet, 
  injected, 
  walletConnect 
} from "wagmi/connectors";

export const config = createConfig({
  chains: [base, baseSepolia],
  multiInjectedProviderDiscovery: true,
  connectors: [
    coinbaseWallet({
      appName: "Payless Protocol",
      appLogoUrl: "https://paylessprotocol.xyz/logo.png",
      preference: {
        options: "smartWalletOnly",
      },
    }),
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
    }),
  ],
  ssr: true,
  transports: {
    [base.id]: http(
      process.env.NEXT_PUBLIC_BASE_RPC_URL ?? "https://mainnet.base.org"
    ),
    [baseSepolia.id]: http("https://sepolia.base.org"),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
