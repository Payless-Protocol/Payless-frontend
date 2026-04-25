import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";

export default function SearchGate() {
  return (
    <section className="bg-[#0a0a0e] px-4 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-xs font-medium text-white/70">
            Gate 1 - Read registry()
          </div>
          <h1 className="mt-5 font-display text-[clamp(2.3rem,4vw,3.5rem)] font-extrabold tracking-[-0.04em] text-white">
            Search a Device
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
            Check a device status on-chain before a purchase. No wallet is required for a search.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="space-y-6">
            <div className="space-y-3">
              <h2 className="font-display text-2xl font-bold text-white">IMEI Lookup</h2>
              <p className="text-sm leading-6 text-white/55">
                Enter the device identifier you want to verify and compare it with the on-chain registry.
              </p>
            </div>

            <Input
              label="IMEI or hash"
              placeholder="356938035643809 or 0x..."
              helperText="Use the IMEI or the already-hashed bytes32 value."
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="sm:min-w-[180px]">Search Registry</Button>
              <Button variant="ghost" className="sm:min-w-[180px]">
                Clear
              </Button>
            </div>
          </Card>

          <Card className="space-y-6 bg-[#10131d]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/35">Registry Result</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-white">Device Record</h2>
              </div>
              <StatusBadge status="clean" />
            </div>

            <div className="grid gap-4 rounded-[18px] border border-white/10 bg-white/[0.03] p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">IMEI Hash</p>
                <p className="mt-2 break-all text-sm text-white/85">0x9f5b...3a21</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">Reported By</p>
                <p className="mt-2 text-sm text-white/85">0x0000...cafe</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">Notes</p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  This is the public preview state for the registry UI. Connect the contract to
                  populate live records.
                </p>
              </div>
            </div>

            <div className="rounded-[18px] border border-[#22c55e]/20 bg-[#22c55e]/10 p-4 text-sm text-[#b8f7c7]">
              The record is currently clean.
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
