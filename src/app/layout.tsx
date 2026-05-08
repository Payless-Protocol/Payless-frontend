import "./globals.css";
import type { ReactNode } from "react";
import Providers from "@/components/Providers";
import { TOKENS } from "@/styles/tokens";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata = {
  title: "Payless Protocol — Stolen Device Registry on Base",
  description: "The decentralized IMEI registry that protects buyers, sellers, and marketplaces. Built on Base.",
  openGraph: {
    title: "Payless Protocol",
    description: "Make stolen devices worthless.",
    url: "https://paylessprotocol.xyz",
    siteName: "Payless Protocol",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Payless Protocol",
    description: "Make stolen devices worthless.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>

        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
