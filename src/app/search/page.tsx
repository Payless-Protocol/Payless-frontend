import type { Metadata } from "next";
import { SearchGate } from "@/components/gates/SearchGate";

export const metadata: Metadata = {
  title: "Search | Payless Protocol",
  description: "Check whether a device IMEI has been flagged on-chain.",
};

export default function Page() {
  return <SearchGate />;
}
