// Device registry result from contract
export interface DeviceRecord {
  secretHash: `0x${string}`;
  updateAt: bigint;
  status: number;
}

// Parsed device result for UI
export interface ParsedDeviceResult {
  flagged: boolean;
  timestamp: bigint;
  formattedDate: string;
}

// Waitlist form data
export interface WaitlistEntry {
  name: string;
  email: string;
}

// Gate page shared state shape
export interface GateState {
  imei: string;
  words: [string, string, string];
  isLoading: boolean;
  error: string | null;
}
