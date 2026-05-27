import type { Metadata } from "next";
import { FlagGate } from "@/components/gates/FlagGate";

export const metadata: Metadata = {
  title: "Flag | Payless Protocol",
  description: "Flag a lost or stolen device on-chain using a 3-word secret phrase.",
};

export default function Page() {
  return <FlagGate />;
}
