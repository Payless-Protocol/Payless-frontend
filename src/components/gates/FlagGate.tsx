"use client";

import { type FormEvent, useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useFlagDevice } from "@/hooks/useFlagDevice";
import { useWallet } from "@/hooks/useWallet";

export default function FlagGate() {
  const [imei, setImei] = useState("");
  const [secret, setSecret] = useState("");
  const [notes, setNotes] = useState("");
  const { flagDevice, isLoading, error, txHash } = useFlagDevice();
  const { address, connect, isConnecting } = useWallet();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await flagDevice(imei, secret);
    } catch {
      // Error state handled by the hook.
    }
  }

  return (
    <section className="bg-[#0a0a0e] px-4 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-xs font-medium text-white/70">
            Gate 2 - Write flagDevice()
          </div>
          <h1 className="mt-5 font-display text-[clamp(2.3rem,4vw,3.5rem)] font-extrabold tracking-[-0.04em] text-white">
            Report a Lost or Stolen Device
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
            Hash the IMEI and secret before sending the flag transaction to the contract.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <Card className="space-y-5">
            <h2 className="font-display text-2xl font-bold text-white">Before You Report</h2>
            <div className="space-y-3 text-sm leading-6 text-white/60">
              <p>Use the exact device identifier.</p>
              <p>Keep the secret key ready.</p>
              <p>Connect a wallet before submitting the flag transaction.</p>
            </div>
            <div className="rounded-[18px] border border-[#6b8fff]/20 bg-[#6b8fff]/10 p-4 text-sm text-[#d6e2ff]">
              {address ? `Wallet connected: ${address}` : "Connect a wallet to prepare for flagging."}
            </div>
          </Card>

          <Card className="space-y-5">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="IMEI" placeholder="356938035643809" value={imei} onChange={(event) => setImei(event.target.value)} />
                <Input
                  label="Secret"
                  placeholder="Recovery secret"
                  value={secret}
                  onChange={(event) => setSecret(event.target.value)}
                />
              </div>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-white/90">Reason</span>
                <textarea
                  rows={5}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="w-full rounded-[12px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#6b8fff]/50"
                  placeholder="Stolen, lost, or unauthorized resale."
                />
              </label>
              {error ? (
                <div className="rounded-[14px] border border-[#ef4444]/20 bg-[#ef4444]/10 px-4 py-3 text-sm text-[#ffb1b1]">
                  {error}
                </div>
              ) : null}
              {txHash ? (
                <div className="rounded-[14px] border border-[#22c55e]/20 bg-[#22c55e]/10 px-4 py-3 text-sm text-[#b8f7c7]">
                  Transaction submitted: {txHash}
                </div>
              ) : null}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" className="sm:min-w-[190px]" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Flag Device"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="sm:min-w-[190px]"
                  disabled={isConnecting}
                  onClick={() => connect().catch(() => undefined)}
                >
                  {address ? "Wallet Connected" : isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
