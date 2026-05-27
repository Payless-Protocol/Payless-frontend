import { BASE_SEPOLIA_CHAIN_ID } from "./constants";

function getBaseUrl(chainId: number) {
  return chainId === BASE_SEPOLIA_CHAIN_ID
    ? "https://sepolia.basescan.org"
    : "https://basescan.org";
}

export function getTxUrl(txHash: string, chainId: number): string {
  return `${getBaseUrl(chainId)}/tx/${txHash}`;
}

export function getAddressUrl(address: string, chainId: number): string {
  return `${getBaseUrl(chainId)}/address/${address}`;
}
