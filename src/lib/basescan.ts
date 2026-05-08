export function getTxUrl(txHash: string, chainId: number): string {
  const base = chainId === 84532 ? "https://sepolia.basescan.org" : "https://basescan.org";
  return `${base}/tx/${txHash}`;
}

export function getAddressUrl(address: string, chainId: number): string {
  const base = chainId === 84532 ? "https://sepolia.basescan.org" : "https://basescan.org";
  return `${base}/address/${address}`;
}
