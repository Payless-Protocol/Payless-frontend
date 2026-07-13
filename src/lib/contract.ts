import { Contract, JsonRpcProvider } from "ethers";
import { PAYLESS_ABI } from "./abi";
import {
  ACTIVE_CHAIN_ID,
  BASE_MAINNET_CHAIN_ID,
  BASE_MAINNET_RPC,
  BASE_SEPOLIA_CHAIN_ID,
  BASE_SEPOLIA_RPC,
  CONTRACT_ADDRESS,
  SEPOLIA_CONTRACT_ADDRESS,
} from "./constants";

export { PAYLESS_ABI };

export function getContractAddress(chainId: number = ACTIVE_CHAIN_ID): `0x${string}` {
  const address =
    chainId === BASE_MAINNET_CHAIN_ID ? CONTRACT_ADDRESS : SEPOLIA_CONTRACT_ADDRESS;

  // ✅ NEW: Verify addresses are set
  if (!address) {
    const isMainnet = chainId === BASE_MAINNET_CHAIN_ID;
    throw new Error(
      `${isMainnet ? "Mainnet" : "Sepolia"} contract address not configured. Set NEXT_PUBLIC_${isMainnet ? "" : "SEPOLIA_"}CONTRACT_ADDRESS in .env`
    );
  }

  return address as `0x${string}`;
}

export function getReadProvider() {
  const isMainnet = ACTIVE_CHAIN_ID === BASE_MAINNET_CHAIN_ID;
  const rpcUrl = isMainnet ? BASE_MAINNET_RPC : BASE_SEPOLIA_RPC;
  const chainId = isMainnet ? BASE_MAINNET_CHAIN_ID : BASE_SEPOLIA_CHAIN_ID;

  return new JsonRpcProvider(rpcUrl, chainId);
}

export function getReadContract(chainId = ACTIVE_CHAIN_ID) {
  const address = getContractAddress(chainId);
  return new Contract(address, PAYLESS_ABI, getReadProvider());
}

export function formatContractError(error: unknown, fallback: string) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error
        ? String((error as { message?: unknown }).message ?? "")
        : "";

  if (/AlreadyUnflagged/i.test(message)) return "Device is already clean.";
  if (/InvalidImei/i.test(message)) return "Invalid device ID.";
  if (/InvalidSecret/i.test(message)) return "Invalid secret phrase.";
  if (/Unauthorized/i.test(message)) return "You are not authorized to unflag this device.";

  return fallback;
}
