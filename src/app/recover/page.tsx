import type { Metadata } from "next";
import RecoverGate from "@/components/gates/RecoverGate";

export const metadata: Metadata = {
  title: "Recover | Payless Protocol",
};

export default function RecoverPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <RecoverGate />
    </div>
  );
}
