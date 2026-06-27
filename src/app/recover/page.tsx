import type { Metadata } from "next";
import RecoverGate from "@/components/gates/RecoverGate";

export const metadata: Metadata = {
  title: "Recover | Payless Protocol",
};

export default function RecoverPage() {
  return <RecoverGate />;
}
