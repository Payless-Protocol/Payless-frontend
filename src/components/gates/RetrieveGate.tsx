"use client";

import { type FormEvent, useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useUnflagDevice } from "@/hooks/useUnflagDevice";
import { useWallet } from "@/hooks/useWallet";

export default function RetrieveGate() {
  const [imei, setImei] = useState("");
  const [secret, setSecret] = useState("");
  const [reference, setReference] = useState("");
  const { unflagDevice, isLoading, error, txHash } = useUnflagDevice();
  const { address, connect, isConnecting } = useWallet();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await unflagDevice(imei, secret);
    } catch {
      // Error state handled by the hook.
    }
  }

  return (
    <section className="bg-bg px-4 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="inline-flex rounded-full border border-border-subtle bg-text-primary/[0.08] px-4 py-2 text-xs font-medium text-text-primary/70">
            Gate 3 - Write unflagDevice()
          </div>
          <h1 className="mt-5 font-display text-[clamp(2.3rem,4vw,3.5rem)] font-extrabold tracking-[-0.04em] text-text-primary">
            Retrieve a Cleared Device
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
            Clear a device after resolution by hashing the IMEI and secret before the write.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Card className="space-y-5">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <h2 className="font-display text-2xl font-bold text-text-primary">Recovery Check</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="IMEI" placeholder="356938035643809" value={imei} onChange={(event) => setImei(event.target.value)} />
                <Input
                  label="Secret"
                  placeholder="Recovery secret"
                  value={secret}
                  onChange={(event) => setSecret(event.target.value)}
                />
              </div>
              <Input
                label="Resolution reference"
                placeholder="Case or ticket number"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                helperText="Optional proof that the report has been resolved."
              />
              {error ? (
                <div className="rounded-[14px] border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              ) : null}
              {txHash ? (
                <div className="rounded-[14px] border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
                  Transaction submitted: {txHash}
                </div>
              ) : null}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" className="sm:min-w-[200px]" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Unflag Device"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="sm:min-w-[200px]"
                  disabled={isConnecting}
                  onClick={() => connect().catch(() => undefined)}
                >
                  {address ? "Wallet Connected" : isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="space-y-5 bg-surface-strong">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-text-secondary/45">Recovery Status</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-text-primary">Ready for Review</h2>
            </div>

            <div className="space-y-3 rounded-[18px] border border-border-subtle bg-text-primary/[0.03] p-5 text-sm text-text-secondary">
              <p>Only authorized recovery requests should reach this step.</p>
              <p>The UI is prepared for the on-chain unflag transaction.</p>
              <p>Keep wallet authorization and evidence attached when integrating backend logic.</p>
            </div>

            <div className="rounded-[18px] border border-accent/20 bg-accent/10 p-4 text-sm text-text-primary">
              Once connected, the approved wallet can clear the device record on-chain.
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
