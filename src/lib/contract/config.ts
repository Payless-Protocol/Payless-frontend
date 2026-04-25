import type { ContractConfig } from "@/types";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.trim() ?? "";
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL?.trim() ?? "";
const chainIdValue = process.env.NEXT_PUBLIC_CHAIN_ID?.trim() ?? "";

export const contractConfig: ContractConfig = {
  address: contractAddress,
  rpcUrl,
  chainId: Number(chainIdValue || 0),
};

export function isContractConfigured() {
  return Boolean(contractConfig.address && contractConfig.rpcUrl && contractConfig.chainId);
}
