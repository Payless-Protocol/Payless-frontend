import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Payless Protocol - IMEI Registry",
  description: "Search, flag, and recover IMEI records.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface text-primary min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
