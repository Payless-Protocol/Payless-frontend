import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

export default function FlagGate() {
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
            This flow is wallet-gated and designed to flag a device record on-chain.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <Card className="space-y-5">
            <h2 className="font-display text-2xl font-bold text-white">Before You Report</h2>
            <div className="space-y-3 text-sm leading-6 text-white/60">
              <p>Use the exact device identifier.</p>
              <p>Keep the recovery secret ready.</p>
              <p>Connect a wallet before submitting the flag transaction.</p>
            </div>
            <div className="rounded-[18px] border border-[#6b8fff]/20 bg-[#6b8fff]/10 p-4 text-sm text-[#d6e2ff]">
              The actual contract write will be wired in the next implementation pass.
            </div>
          </Card>

          <Card className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="IMEI or hash" placeholder="356938035643809" />
              <Input label="Recovery secret" placeholder="Secret phrase" />
            </div>
            <Input
              label="Reason"
              placeholder="Stolen, lost, or unauthorized resale"
              helperText="Short description for the public record."
            />
            <label className="block space-y-2">
              <span className="text-sm font-medium text-white/90">Additional details</span>
              <textarea
                rows={5}
                className="w-full rounded-[12px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#6b8fff]/50"
                placeholder="Add optional context for recovery teams or marketplaces."
              />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="sm:min-w-[190px]">Flag Device</Button>
              <Button variant="ghost" className="sm:min-w-[190px]">
                Connect Wallet
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
