// Matches the on-chain enum Payless.Status
export enum DeviceStatus {
  Unflagged = 0,
  Flagged = 1,
}

export function parseStatus(raw: number): DeviceStatus {
  if (raw === 1) return DeviceStatus.Flagged;
  return DeviceStatus.Unflagged;
}

export function isDeviceFlagged(raw: number): boolean {
  return raw === 1;
}

export function formatTimestamp(updateAt: bigint): string {
  if (updateAt === BigInt(0)) return "Unknown";
  // uint64 is seconds since epoch
  return new Date(Number(updateAt) * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
