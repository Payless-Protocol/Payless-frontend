import {
  BrowserProvider,
  Contract,
  JsonRpcProvider,
  getAddress,
  isAddress,
  type ContractRunner,
} from "ethers";

import { PAYLESS_ABI } from "@/lib/contract/abi";
import { contractConfig, isContractConfigured } from "@/lib/contract/config";

let rpcProvider: JsonRpcProvider | null = null;

export function getContractAddress() {
  if (!contractConfig.address) {
    throw new Error("Missing NEXT_PUBLIC_CONTRACT_ADDRESS");
  }
  return getAddress(contractConfig.address);
}

export function getRpcProvider() {
  if (!isContractConfigured()) {
    throw new Error("Missing contract configuration");
  }

  if (!rpcProvider) {
    rpcProvider = new JsonRpcProvider(contractConfig.rpcUrl, contractConfig.chainId);
  }

  return rpcProvider;
}

export function getReadContract() {
  return new Contract(getContractAddress(), PAYLESS_ABI, getRpcProvider());
}

export async function getWalletProvider() {
  const ethereum = typeof window === "undefined" ? null : (window as Window & { ethereum?: unknown }).ethereum;

  if (!ethereum) {
    throw new Error("Wallet not available");
  }

  return new BrowserProvider(ethereum as never);
}

export async function getSigner() {
  const provider = await getWalletProvider();
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

export async function getWriteContract() {
  const signer = await getSigner();
  return new Contract(getContractAddress(), PAYLESS_ABI, signer);
}

export function shortAddress(address: string) {
  if (!isAddress(address)) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

type ErrorLike = {
  reason?: string;
  shortMessage?: string;
  message?: string;
  errorName?: string;
  info?: {
    error?: {
      name?: string;
      message?: string;
    };
  };
};

export function getFriendlyContractError(error: unknown) {
  const source = error as ErrorLike;
  const name =
    source?.info?.error?.name ??
    source?.errorName ??
    source?.shortMessage ??
    source?.reason ??
    "";

  const message = `${name} ${source?.message ?? ""}`.trim();

  if (message.includes("InvalidImei")) return "Invalid device ID";
  if (message.includes("InvalidSecret")) return "Wrong secret key";
  if (message.includes("Unauthorized")) return "Not allowed";
  if (message.includes("AlreadyUnflagged")) return "Device already clean";

  if (source?.shortMessage) return source.shortMessage;
  if (source?.reason) return source.reason;
  if (source?.message) return source.message;
  return "Something went wrong. Please try again.";
}
