import "./globals.css";
import type { ReactNode } from "react";
import { Web3Provider } from "@/providers/Web3Provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata = {
  title: "Payless Protocol - IMEI Registry",
  description: "Search, flag, and recover IMEI records.",
  metadataBase: new URL("https://paylessprotocol.xyz"),
  openGraph: {
    title: "Payless Protocol",
    description: "Search, flag, and recover IMEI records.",
    url: "https://paylessprotocol.xyz",
    siteName: "Payless Protocol",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Payless Protocol",
    description: "Search, flag, and recover IMEI records.",
    images: ["/og-image.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface text-primary min-h-screen">
        <ErrorBoundary>
          <Web3Provider>{children}</Web3Provider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
