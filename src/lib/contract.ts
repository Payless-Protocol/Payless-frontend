import { BrowserProvider, Contract, JsonRpcProvider, type Signer } from "ethers";
import { PAYLESS_ABI } from "./abi";

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
export const SEPOLIA_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS as `0x${string}`;
export const RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL ?? "";
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "8453");
export { PAYLESS_ABI };

export function getContractAddress(chainId: number): `0x${string}` {
  if (chainId === 84532) return SEPOLIA_CONTRACT_ADDRESS;
  if (chainId === 8453) return CONTRACT_ADDRESS;
  throw new Error(`Unsupported chain: ${chainId}`);
}

export function getReadProvider() {
  const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL;
  if (!rpcUrl) {
    throw new Error(
      "NEXT_PUBLIC_BASE_RPC_URL is not set. " +
      "Add it to .env.local and restart the dev server."
    );
  }

  return new JsonRpcProvider(rpcUrl, CHAIN_ID);
}

export function getReadContract(chainId = CHAIN_ID) {
  const address = getContractAddress(chainId);
  return new Contract(address, PAYLESS_ABI, getReadProvider());
}

export function getWriteContract(signer: Signer | BrowserProvider, chainId = CHAIN_ID) {
  const address = getContractAddress(chainId);
  return new Contract(address, PAYLESS_ABI, signer);
}

export function formatContractError(error: unknown, fallback: string) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error
      ? String((error as { message?: unknown }).message ?? "")
      : "";

  if (/InvalidImei/i.test(message)) return "Invalid device ID";
  if (/InvalidSecret/i.test(message)) return "Wrong secret key";
  if (/Unauthorized/i.test(message)) return "Not allowed";
  if (/AlreadyUnflagged/i.test(message)) return "Device already clean";

  return fallback;
}
