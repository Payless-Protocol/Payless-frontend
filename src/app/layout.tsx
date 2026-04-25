import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Syne } from "next/font/google";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import "@/styles/globals.css";

const displayFont = Syne({
  subsets: ["latin"],
  variable: "--font-display",
});

const sansFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Payless Registry",
  description: "A decentralized stolen device registry built on Base.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-text-primary antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
