export const STATUS = {
  CLEAN: 0,
  FLAGGED: 1,
  VERIFIED: 2,
} as const;

export type DeviceStatus = (typeof STATUS)[keyof typeof STATUS];

export function getStatusLabel(status: DeviceStatus): string {
  switch (status) {
    case STATUS.CLEAN:
      return "Clean";
    case STATUS.FLAGGED:
      return "Flagged";
    case STATUS.VERIFIED:
      return "Verified";
    default:
      return "Unknown";
  }
}
