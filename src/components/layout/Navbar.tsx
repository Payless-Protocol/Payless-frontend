"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/search" },
  { label: "Report", href: "/flag" },
  { label: "Retrieve", href: "/retrieve" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-border-subtle bg-[color:var(--bg)]/95 backdrop-blur-xl"
          : "border-transparent bg-[color:var(--bg)]/82 backdrop-blur-xl",
      ].join(" ")}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Payless Protocol"
            width={32}
            height={32}
            className="h-8 w-8 rounded-[10px] object-contain"
            priority
          />
          <span className="font-display text-[15px] font-semibold tracking-[0.02em] text-text-primary">
            Payless Protocol
          </span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "text-sm font-medium transition-colors duration-200",
                index === 0 ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="#"
            className="hidden rounded-[10px] border border-text-primary/85 px-4 py-2 text-[13px] font-semibold text-text-primary transition hover:border-text-primary hover:bg-text-primary/[0.04] sm:inline-flex"
          >
            Sign Up
          </Link>
          <Link
            href="#"
            className="inline-flex items-center gap-2 rounded-[10px] bg-accent px-4 py-2 text-[13px] font-semibold text-white shadow-[0_14px_26px_rgba(37,99,235,0.22)] transition hover:bg-accent-strong"
          >
            Login Now
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
}
