import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Poppins, Playfair_Display, Bricolage_Grotesque } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const playfairDisplay = Playfair_Display({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  style: ["italic", "normal"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ["600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Payless Protocol",
    default: "Payless Protocol — IMEI Registry",
  },
  description:
    "The decentralized IMEI registry that protects buyers, sellers, and marketplaces.",
  openGraph: {
    title: {
      template: "%s | Payless Protocol",
      default: "Payless Protocol — IMEI Registry",
    },
    description:
      "The decentralized IMEI registry that protects buyers, sellers, and marketplaces.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Payless Protocol IMEI Registry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: "%s | Payless Protocol",
      default: "Payless Protocol — IMEI Registry",
    },
    description:
      "The decentralized IMEI registry that protects buyers, sellers, and marketplaces.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E3ED9",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{ minHeight: "100dvh" }}
        className={`min-h-screen bg-blue text-white ${poppins.variable} ${playfairDisplay.variable} ${bricolageGrotesque.variable}`}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
