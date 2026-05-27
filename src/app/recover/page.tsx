import type { Metadata } from "next";
import { RecoverGate } from "@/components/gates/RecoverGate";

export const metadata: Metadata = {
  title: "Recover | Payless Protocol",
  description: "Recover a flagged device using the original hashed credentials.",
};

export default function Page() {
  return <RecoverGate />;
}
