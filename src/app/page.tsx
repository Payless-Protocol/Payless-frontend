import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

function SectionLabel({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div
      className={[
        "inline-flex rounded-full border border-transparent bg-accent/65 px-4 py-2 text-xs font-medium text-white shadow-[0_12px_24px_rgba(37,99,235,0.16)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function HeroBlob() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[45rem] lg:block">
      <div className="absolute right-0 top-[52%] h-[32rem] w-[32rem] -translate-y-1/2 rounded-[55%_45%_60%_40%/50%_55%_45%_50%] bg-[color:var(--accent-soft)] blur-[2px]" />
      <div className="absolute right-12 top-[51%] h-[25rem] w-[25rem] -translate-y-1/2 rounded-[55%_45%_60%_40%/50%_55%_45%_50%] border border-[color:var(--accent-soft-strong)]" />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-bg">
      <HeroBlob />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 pb-16 pt-10 sm:px-6 lg:px-10">
        <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
          <SectionLabel className="max-w-[43rem]">
            The decentralized IMEI registry that protects buyers, sellers, and marketplaces.
          </SectionLabel>

          <h1 className="mt-8 font-display text-[clamp(3.2rem,8vw,5.8rem)] font-extrabold leading-[0.95] tracking-[-0.05em] text-text-primary">
            <span className="block">Make Stolen Devices</span>
            <span className="block text-accent">Worthless.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-center text-sm leading-7 text-text-secondary sm:text-[15px]">
            Payless Protocol makes stolen devices risky to buy or sell. Instantly flag an IMEI
            on-chain and create a trusted record anyone can verify in seconds.
            <span className="mt-0.5 block">Built on Base, the Carfax for mobile devices.</span>
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
            <Button size="lg" className="min-w-[180px]">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Search IMEI
            </Button>
            <Button variant="ghost" size="lg" className="min-w-[180px]">
              Report Lost Device
            </Button>
          </div>

          <p className="mt-7 text-sm text-text-secondary/70">
            Built On <span className="font-semibold text-accent">Base</span>
          </p>
        </div>
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
    <section className="relative overflow-hidden bg-bg px-4 pb-24 sm:px-6 lg:px-10">
      <div className="absolute right-4 top-0 hidden h-72 w-72 rounded-[55%_45%_60%_40%/50%_55%_45%_50%] bg-[color:var(--accent-soft)] blur-[2px] lg:block" />
      <div className="mx-auto max-w-7xl">
        <SectionLabel>Get to use our powerful tools.</SectionLabel>

        <h2 className="mt-6 max-w-3xl font-display text-[clamp(2.6rem,5vw,4.25rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-text-primary">
          Powerful Tools, Built
          <span className="block sm:inline"> for Fast <span className="text-accent">Action</span>.</span>
        </h2>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {cards.map((card) => (
            <Card
              key={card.title}
              className={[
                "relative flex min-h-[20rem] flex-col overflow-hidden border-[color:var(--border-strong)] transition-transform duration-300 hover:-translate-y-1",
                card.accent
                  ? "border-transparent bg-accent text-bg lg:-translate-y-5"
                  : "bg-bg text-text-primary",
              ].join(" ")}
            >
              <div
                className={[
                  "mb-10 h-12 w-12 rounded-full",
                  card.accent ? "bg-bg/85" : "bg-text-primary",
                ].join(" ")}
              />

              <h3 className="max-w-[16rem] font-display text-[1.35rem] font-bold leading-tight">
                {card.title}
              </h3>
              <p
                className={[
                  "mt-4 max-w-[18rem] text-[13px] leading-6",
                  card.accent ? "text-bg/90" : "text-text-primary/70",
                ].join(" ")}
              >
                {card.desc}
              </p>

              <div className="mt-auto pt-10">
                <Button
                  variant={card.accent ? "outline" : "ghost"}
                  className={[
                    "ml-auto",
                    card.accent
                      ? "border-transparent bg-[color:var(--bg)] text-text-primary hover:bg-[color:var(--bg)]/90"
                      : "border-[color:var(--border-strong)]",
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
  return (
    <section className="overflow-hidden bg-bg px-4 pb-24 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.03fr_0.97fr]">
        <div className="relative overflow-hidden rounded-[32px] bg-[color:var(--surface)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
          <div className="absolute -left-12 bottom-[-64px] h-56 w-56 rounded-[55%_45%_60%_40%/50%_55%_45%_50%] bg-[color:var(--accent-soft)] blur-[1px]" />
          <div className="absolute -bottom-10 -left-8 h-48 w-48 rounded-[55%_45%_60%_40%/50%_55%_45%_50%] border border-[color:var(--accent-soft-strong)]" />
          <div
            className="relative flex h-[20rem] items-center justify-center overflow-hidden rounded-[28px]"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--text-primary) 94%, var(--surface) 6%), color-mix(in srgb, var(--text-primary) 80%, var(--surface) 20%))",
            }}
          >
            <div
              className="relative h-[15rem] w-[8rem] rounded-[2.2rem] border-[6px] shadow-[0_18px_35px_rgba(0,0,0,0.25)]"
              style={{
                borderColor: "color-mix(in srgb, var(--surface-strong) 85%, var(--bg) 15%)",
                background: "var(--bg)",
              }}
            >
              <div className="absolute inset-x-[32%] top-2 h-2 rounded-full bg-[color:var(--bg)]" />
              <div
                className="absolute inset-2 rounded-[1.6rem]"
                style={{
                  background:
                    "linear-gradient(180deg, color-mix(in srgb, var(--text-primary) 92%, var(--surface) 8%) 0%, var(--accent) 45%, color-mix(in srgb, var(--accent) 35%, var(--bg) 65%) 100%)",
                }}
              />
              <div className="absolute bottom-[-20px] right-[-12px] h-20 w-20 rounded-full bg-[color:var(--bg)]/25 blur-2xl" />
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex justify-end">
            <SectionLabel>Benefits.</SectionLabel>
          </div>

          <h2 className="mt-8 text-right font-display text-[clamp(2.3rem,4vw,4rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-text-primary">
            Why <span className="text-accent">Payless</span> Changes
            <span className="block">Everything.</span>
          </h2>

          <div className="mt-10 flex flex-col gap-3">
            {["1. Buy With Confidence", "2. Reduced Resale Value for Thieves", "3. Instant Theft Reporting"].map(
              (benefit) => (
                <div
                  key={benefit}
                  className="self-end rounded-[12px] bg-accent/70 px-5 py-3 text-right text-sm font-semibold text-white shadow-[0_16px_32px_rgba(0,0,0,0.22)]"
                >
                  {benefit}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-bg px-4 pb-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div
          className="relative overflow-hidden rounded-[34px] border border-[color:var(--accent)]/10 px-6 py-20 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:px-10"
          style={{
            background:
              "linear-gradient(145deg, color-mix(in srgb, var(--surface-strong) 92%, var(--bg) 8%), color-mix(in srgb, var(--surface-strong) 70%, var(--accent) 30%) 50%, color-mix(in srgb, var(--surface-strong) 85%, var(--bg) 15%))",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05),_transparent_35%)] opacity-60" />
          <div className="relative z-10">
            <SectionLabel>Take action in seconds with fast and trusted device verification.</SectionLabel>
            <h2 className="mt-8 font-display text-[clamp(2.5rem,5vw,4.35rem)] font-extrabold leading-[1.06] tracking-[-0.045em] text-text-primary">
              Protect Your <span className="text-accent">Device</span>. Protect
              <span className="block">Your Next <span className="text-accent">Purchase</span>.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-text-secondary">
              Search an IMEI before you buy or report a lost or stolen device instantly.
              Payless helps buyers stay safe and makes stolen devices harder to trade.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                Search IMEI
              </Button>
              <Button variant="ghost" size="lg">
                Join Our Waitlist
              </Button>
            </div>
            <p className="mt-8 text-sm text-text-secondary/70">
              Built On <span className="font-semibold text-accent">Base</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="bg-bg">
      <HeroSection />
      <ToolsSection />
      <BenefitsSection />
      <CTASection />
    </div>
  );
}
