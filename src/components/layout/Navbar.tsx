"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useWallet } from "@/hooks/useWallet";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
  { label: "Report", href: "/flag" },
  { label: "Retrieve", href: "/retrieve" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { address, shortAddress, connect, disconnect, isConnecting } = useWallet();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 border-b border-transparent transition-all duration-300",
        scrolled ? "border-white/10 bg-[#0a0a0e]/92 backdrop-blur-xl" : "bg-[#0a0a0e]/70 backdrop-blur-xl",
      ].join(" ")}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#6b8fff] to-[#89a6ff] text-sm font-bold text-white shadow-lg shadow-[#6b8fff]/20">
            P
          </span>
          <span className="font-display text-[15px] font-semibold tracking-[0.02em] text-white">
            Payless Protocol
          </span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "text-sm transition-colors duration-200",
                pathname === link.href || (link.href === "/" && pathname === "/")
                  ? "font-semibold text-white"
                  : index === 0
                    ? "text-white/65 hover:text-white"
                    : "text-white/55 hover:text-white",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/flag"
            className="hidden rounded-[10px] border border-white/20 px-4 py-2 text-[13px] font-medium text-white transition hover:border-white/50 hover:bg-white/5 sm:inline-flex"
          >
            Report Device
          </Link>
          <button
            type="button"
            onClick={() => {
              if (address) {
                disconnect();
                return;
              }

              connect().catch(() => undefined);
            }}
            className="inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-[#6b8fff] to-[#89a6ff] px-4 py-2 text-[13px] font-medium text-white shadow-[0_12px_28px_rgba(107,143,255,0.24)] transition hover:opacity-90"
          >
            {isConnecting ? "Connecting..." : address ? shortAddress ?? address : "Connect Wallet"}
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
