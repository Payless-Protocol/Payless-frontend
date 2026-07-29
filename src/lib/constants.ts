import { base, baseSepolia } from "viem/chains";
import type { Chain } from "viem";

export const BASE_MAINNET_CHAIN_ID = 8453;
export const BASE_SEPOLIA_CHAIN_ID = 84532;

export const BASE_MAINNET_RPC =
  process.env.NEXT_PUBLIC_BASE_RPC_URL ?? "https://mainnet.base.org";
export const BASE_SEPOLIA_RPC = "https://sepolia.base.org";

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";
export const SEPOLIA_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS ?? "";

export function validateRpcEndpoint(): boolean {
  const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL;
  if (!rpcUrl) {
    console.warn('[Constants] ⚠️ NEXT_PUBLIC_BASE_RPC_URL not configured');
    return false;
  }
  return rpcUrl.startsWith('https://');
}

export const ACTIVE_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID ?? BASE_SEPOLIA_CHAIN_ID
);

// ── Startup validation ────────────────────────────────────────────
// Fail loudly in dev rather than silently passing "" into viem,
// which throws an unhelpful "invalid address" error deep in a
// contract call instead of at boot.
if (typeof window !== "undefined") {
  const isMainnet = ACTIVE_CHAIN_ID === BASE_MAINNET_CHAIN_ID;
  const activeAddress = isMainnet ? CONTRACT_ADDRESS : SEPOLIA_CONTRACT_ADDRESS;
  if (!activeAddress) {
    console.error(
      `[constants] Missing contract address for chain ${ACTIVE_CHAIN_ID}. ` +
      `Set NEXT_PUBLIC_${isMainnet ? "" : "SEPOLIA_"}CONTRACT_ADDRESS.`
    );
  }
}

// ── Chain object resolver ─────────────────────────────────────────
// Returns the actual viem Chain object matching ACTIVE_CHAIN_ID, so
// components never need to import/hardcode `baseSepolia` or `base`
// directly — flipping networks is a single env var change.
export function getActiveChain(): Chain {
  return ACTIVE_CHAIN_ID === BASE_MAINNET_CHAIN_ID ? base : baseSepolia;
}
