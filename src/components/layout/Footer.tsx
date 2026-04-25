const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
  { label: "Report", href: "/flag" },
  { label: "Retrieve", href: "/retrieve" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0e] px-4 py-5 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-to-br from-[#6b8fff] to-[#89a6ff] text-xs font-bold text-white">
            P
          </span>
          <span className="font-display text-sm font-semibold text-white/85">
            Payless Protocol
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {footerLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "rounded-full px-3 py-2 text-sm transition",
                index === 0 ? "bg-white/[0.08] font-semibold text-white" : "text-white/45 hover:text-white",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2 text-sm text-white/45 sm:flex-row sm:items-center sm:gap-4">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
            Base network online
          </span>
          <a href="https://basescan.org" target="_blank" rel="noreferrer" className="text-[#89a6ff] transition hover:text-white">
            BaseScan
          </a>
        </div>
      </div>
    </footer>
  );
}
