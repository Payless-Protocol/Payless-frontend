"use client";

import { type FormEvent, useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";
import { useRegistry } from "@/hooks/useRegistry";

export default function SearchGate() {
  const [imei, setImei] = useState("");
  const { record, isLoading, error, search, reset } = useRegistry();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await search(imei);
    } catch {
      // Error state is handled by the hook.
    }
  }

  function handleClear() {
    setImei("");
    reset();
  }

  return (
    <section className="bg-bg px-4 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="inline-flex rounded-full border border-border-subtle bg-text-primary/[0.08] px-4 py-2 text-xs font-medium text-text-primary/70">
            Gate 1 - Read registry()
          </div>
          <h1 className="mt-5 font-display text-[clamp(2.3rem,4vw,3.5rem)] font-extrabold tracking-[-0.04em] text-text-primary">
            Search a Device
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
            Enter an IMEI to hash it and check the registry without connecting a wallet.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="space-y-6">
            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-text-primary">IMEI Lookup</h2>
              <p className="text-sm leading-6 text-text-secondary">
                The input is hashed with keccak256 before the registry call.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input
                label="IMEI"
                placeholder="356938035643809"
                helperText="We hash the IMEI before querying the contract."
                value={imei}
                onChange={(event) => setImei(event.target.value)}
              />

              {error ? (
                <div className="rounded-[14px] border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" className="sm:min-w-[180px]" disabled={isLoading}>
                  {isLoading ? "Searching..." : "Search Registry"}
                </Button>
                <Button type="button" variant="ghost" className="sm:min-w-[180px]" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </form>
          </Card>

          <Card className="space-y-6 bg-surface-strong">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-text-secondary/45">Registry Result</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-text-primary">Device Record</h2>
              </div>
              <StatusBadge status={record?.status ?? "clean"} />
            </div>

            {record ? (
              <>
                <div className="grid gap-4 rounded-[18px] border border-border-subtle bg-text-primary/[0.03] p-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-text-secondary/45">IMEI Hash</p>
                    <p className="mt-2 break-all text-sm text-text-primary">{record.imeiHash}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-text-secondary/45">Reported By</p>
                    <p className="mt-2 text-sm text-text-primary">{record.reporter ?? "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-text-secondary/45">Last Updated</p>
                    <p className="mt-2 text-sm text-text-primary">{record.lastUpdated ?? "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-text-secondary/45">Notes</p>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">{record.notes ?? "No notes recorded."}</p>
                  </div>
                </div>

                <div
                  className={[
                    "rounded-[18px] border p-4 text-sm",
                    record.status === "clean"
                      ? "border-success/20 bg-success/10 text-success"
                      : "border-danger/20 bg-danger/10 text-danger",
                  ].join(" ")}
                >
                  {record.status === "clean" ? "The record is currently clean." : "The record is currently flagged."}
                </div>
              </>
            ) : (
              <div className="grid gap-4 rounded-[18px] border border-border-subtle bg-text-primary/[0.03] p-5 text-sm leading-6 text-text-secondary">
                <p>Search for an IMEI to see its registry status.</p>
                <p>Results will show the hash, status, reporter, and any stored notes.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
