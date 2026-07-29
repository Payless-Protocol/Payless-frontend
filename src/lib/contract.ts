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

export function isValidHexAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function getContractAddress(chainId: number = ACTIVE_CHAIN_ID): `0x${string}` {
  const address =
    chainId === BASE_MAINNET_CHAIN_ID ? CONTRACT_ADDRESS : SEPOLIA_CONTRACT_ADDRESS;

  if (!isValidHexAddress(address)) {
    console.error(`[Contract] Invalid contract address format: ${address}`);
    return '0x0000000000000000000000000000000000000000' as `0x${string}`;
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

  // SECURITY: Never log secrets, wallet addresses, or sensitive contract data
  const sanitizedError = message
    .replace(/0x[a-fA-F0-9]{40}/g, '0x****') // Hide addresses
    .replace(/\b\d{15}\b/g, '****') // Hide IMEIs
    .replace(/word1|word2|word3|secret|phrase/gi, '***'); // Hide secret references

  if (/AlreadyUnflagged/i.test(sanitizedError)) return "Device is already clean.";
  if (/InvalidImei/i.test(sanitizedError)) return "Invalid device ID.";
  if (/InvalidSecret/i.test(sanitizedError)) return "Invalid secret phrase.";
  if (/Unauthorized/i.test(sanitizedError)) return "You are not authorized to unflag this device.";

  return fallback;
}
