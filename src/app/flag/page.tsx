import type { Metadata } from "next";
import FlagGate from "@/components/gates/FlagGate";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Flag | Payless Protocol",
  description: "Flag a lost or stolen device on-chain using a 3-word secret phrase.",
};

export default function FlagPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-12 sm:py-16">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
              Report
            </div>
            <h1 className="mb-4 font-syne text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Report <span className="text-red-500">Lost or Stolen</span> Device
            </h1>
            <p className="mx-auto max-w-xl text-base text-neutral-400">
              Write the IMEI hash to the registry from a connected wallet so others can see the report.
            </p>
          </div>

          {/* Warning Alert */}
          <div className="mb-8 rounded-lg border border-red-900/40 bg-red-950/20 p-4 text-red-200">
            <div className="flex gap-3">
              <div className="flex-shrink-0 text-red-500">⚠</div>
              <div>
                <p className="font-semibold">Important Notice</p>
                <p className="mt-1 text-sm">
                  This action writes to the registry and cannot be undone. Make sure the IMEI and secret phrase are correct.
                </p>
              </div>
            </div>
          </div>

          {/* Form Component */}
          <FlagGate />
        </div>
      </main>
    </>
  );
}
