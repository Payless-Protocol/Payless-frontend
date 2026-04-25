import Link from "next/link";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
  { label: "Report", href: "/flag" },
  { label: "Retrieve", href: "/retrieve" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg px-4 py-5 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-to-br from-accent to-accent-strong text-xs font-bold text-bg shadow-[0_12px_24px_rgba(107,143,255,0.18)]">
            P
          </span>
          <span className="font-display text-sm font-semibold text-text-primary">
            Payless Protocol
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {footerLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "rounded-full px-4 py-2 text-sm transition",
                index === 0
                  ? "bg-[color:var(--accent)]/40 font-semibold text-text-primary"
                  : "text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
