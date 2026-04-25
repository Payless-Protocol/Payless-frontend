import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

export default function RetrieveGate() {
  return (
    <section className="bg-[#0a0a0e] px-4 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-xs font-medium text-white/70">
            Gate 3 - Write unflagDevice()
          </div>
          <h1 className="mt-5 font-display text-[clamp(2.3rem,4vw,3.5rem)] font-extrabold tracking-[-0.04em] text-white">
            Retrieve a Cleared Device
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
            Use this flow to remove a flag after a successful recovery or dispute resolution.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Card className="space-y-5">
            <h2 className="font-display text-2xl font-bold text-white">Recovery Check</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="IMEI or hash" placeholder="356938035643809" />
              <Input label="Recovery secret" placeholder="Secret phrase" />
            </div>
            <Input
              label="Resolution reference"
              placeholder="Case or ticket number"
              helperText="Optional proof that the report has been resolved."
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="sm:min-w-[200px]">Unflag Device</Button>
              <Button variant="ghost" className="sm:min-w-[200px]">
                Connect Wallet
              </Button>
            </div>
          </Card>

          <Card className="space-y-5 bg-[#10131d]">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-white/35">Recovery Status</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-white">Ready for Review</h2>
            </div>

            <div className="space-y-3 rounded-[18px] border border-white/10 bg-white/[0.03] p-5 text-sm text-white/65">
              <p>Only authorized recovery requests should reach this step.</p>
              <p>The current UI is prepared for a future unflag transaction.</p>
              <p>Keep wallet authorization and evidence attached when integrating backend logic.</p>
            </div>

            <div className="rounded-[18px] border border-[#6b8fff]/20 bg-[#6b8fff]/10 p-4 text-sm text-[#d6e2ff]">
              Once connected, the approved wallet can clear the device record on-chain.
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
