import type { Metadata } from "next";
import FlagGate from "@/components/gates/FlagGate";

export const metadata: Metadata = {
  title: "Flag | Payless Protocol",
};

export default function FlagPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <FlagGate />
    </div>
  );
}
