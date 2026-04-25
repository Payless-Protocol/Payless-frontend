import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-xs font-medium text-white/70">
      {children}
    </div>
  );
}

function HeroArtwork() {
  return (
    <div className="relative mx-auto flex w-full max-w-[28rem] items-center justify-center pt-4 lg:pt-0">
      <div className="absolute right-0 top-1/2 h-[20rem] w-[20rem] -translate-y-1/2 rounded-[55%_45%_60%_40%/50%_55%_45%_50%] bg-[#6b8fff]/22 blur-[2px] lg:h-[28rem] lg:w-[28rem]" />
      <div className="absolute right-5 top-1/2 h-[18rem] w-[18rem] -translate-y-1/2 rounded-[55%_45%_60%_40%/50%_55%_45%_50%] border border-[#6b8fff]/20 lg:h-[23rem] lg:w-[23rem]" />
      <div className="relative h-[18rem] w-[18rem] rounded-[40px] border border-white/10 bg-[#11131a] shadow-[0_20px_60px_rgba(0,0,0,0.35)] lg:h-[23rem] lg:w-[23rem]">
        <div className="absolute inset-4 rounded-[30px] bg-gradient-to-br from-[#25304f] via-[#17203a] to-[#091121]" />
        <div className="absolute inset-x-[28%] top-3 h-2 rounded-full bg-black/35" />
        <div className="absolute inset-0 rounded-[40px] ring-1 ring-white/5" />
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(107,143,255,0.18),_transparent_28%),linear-gradient(180deg,#0a0a0e_0%,#0a0a0e_100%)]">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pt-20">
        <div className="relative z-10 mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          <div className="flex justify-center lg:justify-start">
            <SectionLabel>
              The decentralized IMEI registry that protects buyers, sellers, and marketplaces.
            </SectionLabel>
          </div>

          <h1 className="mt-8 font-display text-[clamp(3.2rem,8vw,5.6rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-white">
            Make Stolen Devices
            <span className="block text-[#6b8fff]">Worthless.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-text-secondary lg:mx-0 lg:text-[15px]">
            Payless Protocol makes stolen devices risky to buy or sell. Instantly flag an IMEI
            on-chain and create a trusted record anyone can verify in seconds. Built on Base,
            the Carfax for mobile devices.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button size="lg" className="min-w-[180px]">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Search IMEI
            </Button>
            <Button variant="ghost" size="lg" className="min-w-[180px]">
              Report Lost Device
            </Button>
          </div>

          <p className="mt-7 text-sm text-white/40">
            Built On <span className="font-semibold text-[#89a6ff]">Base</span>
          </p>
        </div>

        <HeroArtwork />
      </div>
    </section>
  );
}

function ToolsSection() {
  const cards = [
    {
      title: "Retrieve IMEI",
      desc: "Find your IMEI when it's unknown. Let's guide you through simple steps to retrieve it quickly and continue the process.",
      cta: "Retrieve Now",
      accent: false,
    },
    {
      title: "Report Lost Or Stolen Phone",
      desc: "Flags a device as lost or stolen, triggering an alert that helps prevent misuse and boost recovery chances.",
      cta: "Report Lost Device",
      accent: true,
    },
    {
      title: "Search IMEI Status",
      desc: "Know the status of a device before buying, helping you avoid stolen hardware and buy with confidence.",
      cta: "Start Searching",
      accent: false,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0a0a0e] px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionLabel>Explore our powerful tools.</SectionLabel>
        <h2 className="mt-6 max-w-3xl font-display text-[clamp(2.4rem,5vw,4.1rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-white">
          Powerful Tools, Built
          <span className="block sm:inline"> for Fast <span className="text-[#6b8fff]">Action</span>.</span>
        </h2>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {cards.map((card) => (
            <Card
              key={card.title}
              className={[
                "relative overflow-hidden transition-transform duration-300 hover:-translate-y-1",
                card.accent
                  ? "border-transparent bg-[#6b8fff] text-[#10121a] lg:-translate-y-3"
                  : "bg-[#101113] text-white",
              ].join(" ")}
            >
              <div
                className={[
                  "mb-14 h-11 w-11 rounded-full",
                  card.accent ? "bg-black/25" : "bg-white",
                ].join(" ")}
              />

              <h3 className="font-display text-[18px] font-bold leading-tight">
                {card.title}
              </h3>
              <p
                className={[
                  "mt-3 text-[13px] leading-6",
                  card.accent ? "text-[#0f1728]/90" : "text-white/65",
                ].join(" ")}
              >
                {card.desc}
              </p>

              <div className="mt-8">
                <Button
                  variant={card.accent ? "outline" : "ghost"}
                  className={[
                    card.accent
                      ? "border-transparent bg-[#0a0a0e] text-white hover:bg-[#0a0a0e]/90"
                      : "border-white/25",
                  ].join(" ")}
                >
                  {card.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const benefits = [
    "1. Buy With Confidence",
    "2. Reduced Resale Value for Thieves",
    "3. Instant Theft Reporting",
  ];

  return (
    <section className="relative overflow-hidden bg-[#0a0a0e] px-4 pb-24 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
        <div className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(145deg,#dbdbdd,#f2f2f4)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
          <div className="absolute -left-12 bottom-[-64px] h-56 w-56 rounded-[55%_45%_60%_40%/50%_55%_45%_50%] bg-[#6b8fff]/45 blur-[1px]" />
          <div className="absolute -bottom-10 -left-8 h-48 w-48 rounded-[55%_45%_60%_40%/50%_55%_45%_50%] border border-[#3e4c79]/50" />
          <div className="relative flex h-[20rem] items-center justify-center overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#ffffff,#cfd7e8)]">
            <div className="relative h-[15rem] w-[8rem] rounded-[2.2rem] border-[6px] border-[#17181f] bg-black shadow-[0_18px_35px_rgba(0,0,0,0.25)]">
              <div className="absolute inset-x-[32%] top-2 h-2 rounded-full bg-black/85" />
              <div className="absolute inset-2 rounded-[1.6rem] bg-[linear-gradient(180deg,#d8e0ee_0%,#8cc2ff_45%,#084d8a_100%)]" />
              <div className="absolute bottom-[-20px] right-[-12px] h-20 w-20 rounded-full bg-black/25 blur-2xl" />
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex justify-end">
            <SectionLabel>Benefits.</SectionLabel>
          </div>

          <h2 className="mt-8 text-right font-display text-[clamp(2.2rem,4vw,3.9rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-white">
            Why <span className="text-[#6b8fff]">Payless</span> Changes
            <span className="block">Everything.</span>
          </h2>

          <div className="mt-10 flex flex-col gap-3">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="self-end rounded-[12px] bg-[#5e74a8] px-5 py-3 text-right text-sm font-semibold text-white shadow-[0_16px_32px_rgba(0,0,0,0.22)]"
              >
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-[#0a0a0e] px-4 pb-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[34px] border border-[#a73c3c]/10 bg-[radial-gradient(circle_at_top,_rgba(107,143,255,0.1),_transparent_32%),linear-gradient(145deg,#1b0909,#2a0b0b_50%,#150606)] px-6 py-20 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05),_transparent_35%)] opacity-60" />
          <div className="relative z-10">
            <SectionLabel>Take action in seconds with fast and trusted device verification.</SectionLabel>
            <h2 className="mt-8 font-display text-[clamp(2.4rem,5vw,4.4rem)] font-extrabold leading-[1.06] tracking-[-0.04em] text-white">
              Protect Your <span className="text-[#6b8fff]">Device</span>. Protect
              <span className="block">Your Next <span className="text-[#6b8fff]">Purchase</span>.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/60">
              Search an IMEI before you buy or report a lost or stolen device instantly.
              Payless helps buyers stay safe and makes stolen devices harder to trade.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                Search IMEI
              </Button>
              <Button variant="ghost" size="lg">
                Join Our Waitlist
              </Button>
            </div>
            <p className="mt-8 text-sm text-white/35">
              Built On <span className="font-semibold text-[#89a6ff]">Base</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="bg-[#0a0a0e]">
      <HeroSection />
      <ToolsSection />
      <BenefitsSection />
      <CTASection />
    </div>
  );
}
