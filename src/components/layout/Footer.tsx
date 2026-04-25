import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
  { label: "Report", href: "/flag" },
  { label: "Retrieve", href: "/retrieve" },
];

export default function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-4 z-50 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/8 bg-[rgba(5,5,5,0.62)] px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.38)] backdrop-blur-[12px]">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Payless Protocol" width={30} height={30} className="h-7 w-7 rounded-[8px] object-contain" />
          <span className="font-display text-sm font-semibold text-text-primary">
            Payless Protocol
          </span>
        </Link>

        <div className="hidden items-center gap-2 rounded-full bg-white/[0.05] p-1 md:flex">
          {footerLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "rounded-full px-4 py-2 text-sm transition",
                index === 0
                  ? "bg-accent/35 font-semibold text-text-primary"
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
