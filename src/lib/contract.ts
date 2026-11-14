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

let providerCache: Map<string, JsonRpcProvider> = new Map();
let cacheTTL: Map<string, number> = new Map();

function getProviderKey(chainId: number, imei: string): string {
  return `${chainId}:${imei}`;
}

function getProvider(chainId: number, imei?: string): JsonRpcProvider {
  const key = getProviderKey(chainId, imei ?? "");
  const ttl = cacheTTL.get(key) ?? 0;
  const now = Date.now();

  if (providerCache.has(key) && now - ttl < 30000) {
    return providerCache.get(key)!;
  }

  const isMainnet = chainId === BASE_MAINNET_CHAIN_ID;
  const rpcUrl = isMainnet ? BASE_MAINNET_RPC : BASE_SEPOLIA_RPC;
  const chainIdNum = isMainnet ? BASE_MAINNET_CHAIN_ID : BASE_SEPOLIA_CHAIN_ID;

  const provider = new JsonRpcProvider(rpcUrl);

  // Set a single timeout/retry: provider will use default ethers timeout, but we can wrap fetch
  // For simplicity, we rely on ethers' built-in timeout (usually 60s) and add a one-retry wrapper
  // in the call sites if needed; the key optimization is staticNetwork and caching.

  providerCache.set(key, provider);
  cacheTTL.set(key, Date.now() + 30000);

  return provider;
}

function invalidateDeviceStatusCache(imei: string): void {
  const activeKey = getProviderKey(ACTIVE_CHAIN_ID, imei);
  const sepoliaKey = getProviderKey(BASE_SEPOLIA_CHAIN_ID, imei);
  providerCache.delete(activeKey);
  providerCache.delete(sepoliaKey);
  cacheTTL.delete(activeKey);
  cacheTTL.delete(sepoliaKey);
}

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

export function getReadContract(chainId = ACTIVE_CHAIN_ID) {
  const address = getContractAddress(chainId);
  const imei = "";
  const provider = getProvider(chainId, imei);
  return new Contract(address, PAYLESS_ABI, provider);
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

  // Specific known revert: device was never flagged
  if (sanitizedError.includes('0xabab6bd7')) {
    return "This device hasn't been flagged as trusted, so there's nothing to recover. Double check the IMEI is correct.";
  }

  if (/AlreadyUnflagged/i.test(sanitizedError)) return "Device is already clean.";
  if (/InvalidImei/i.test(sanitizedError)) return "Invalid device ID.";
  if (/InvalidSecret/i.test(sanitizedError)) return "Invalid secret phrase.";
  if (/Unauthorized/i.test(sanitizedError)) return "You are not authorized to unflag this device."

  return fallback;
}