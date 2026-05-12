import "./globals.css";
import type { ReactNode } from "react";
import Providers from "@/components/Providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata = {
  title: "Payless Protocol - IMEI Registry",
  description: "Search, report, and recover IMEI records.",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  openGraph: {
    title: "Payless Protocol",
    description: "Search, report, and recover IMEI records.",
    url: "https://paylessprotocol.xyz",
    siteName: "Payless Protocol",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Payless Protocol",
    description: "Search, report, and recover IMEI records.",
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
