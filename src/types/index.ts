import type { ReactNode } from "react";

export type DeviceStatus = "clean" | "flagged";

export interface DeviceRecord {
  imeiHash: `0x${string}`;
  status: DeviceStatus;
  reporter?: string;
  reportedAt?: string;
  lastUpdated?: string;
  notes?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ButtonProps {
  children: ReactNode;
}
