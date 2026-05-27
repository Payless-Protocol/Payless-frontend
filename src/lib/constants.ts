export const BASE_MAINNET_CHAIN_ID = 8453;
export const BASE_SEPOLIA_CHAIN_ID = 84532;

export const BASE_MAINNET_RPC =
  process.env.NEXT_PUBLIC_BASE_RPC_URL ?? "https://mainnet.base.org";
export const BASE_SEPOLIA_RPC = "https://sepolia.base.org";

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";
export const SEPOLIA_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS ?? "";

export const ACTIVE_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID ?? BASE_SEPOLIA_CHAIN_ID
);
