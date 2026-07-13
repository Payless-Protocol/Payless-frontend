import type { Metadata } from "next";
import RecoverGate from "@/components/gates/RecoverGate";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Recover | Payless Protocol",
  description: "Recover a flagged device using the original hashed credentials.",
};

export default function RecoverPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-12 sm:py-16">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
              Retrieve
            </div>
            <h1 className="mb-4 font-syne text-4xl font-bold tracking-tight text-white sm:text-5xl">
              <span className="text-emerald-500">Retrieve</span> Your Device
            </h1>
            <p className="mx-auto max-w-xl text-base text-neutral-400">
              Use the 3-word recovery phrase to remove the flag from the registry.
            </p>
          </div>

          {/* Form Component */}
          <RecoverGate />
        </div>
      </main>
    </>
  );
}
