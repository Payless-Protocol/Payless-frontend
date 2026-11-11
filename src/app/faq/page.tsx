import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FaqAccordion, { type FaqItem } from "@/components/FaqAccordion";
import { TOKENS } from "@/styles/tokens";

export const metadata: Metadata = {
  title: "FAQ | Payless Protocol",
  description:
    "Answers to common questions about flagging, retrieving, and searching IMEIs on the Payless registry.",
};

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "What is Payless Protocol?",
    a: "Payless Protocol is a decentralized IMEI registry built on Base. It lets anyone flag a lost or stolen phone on-chain, and lets any buyer check an IMEI in seconds before paying. Think of it as a Carfax for second-hand devices.",
  },
  {
    q: "What is an IMEI and where do I find it?",
    a: "An IMEI is the 15-digit serial number that uniquely identifies a phone. Dial *#06# on the device and the number appears on screen. You can also find it printed on the box or under the battery tray.",
  },
  {
    q: "How do I flag a lost or stolen device?",
    a: "Open the Flag device page, enter the phone's 15-digit IMEI, and choose a 3-word secret phrase. The record is written to the registry immediately, and from that moment onwards anyone who checks that IMEI sees it is stolen.",
  },
  {
    q: "What is the 3-word secret phrase for?",
    a: "The phrase is your key to updating the record later. Only a hash of it is stored on-chain, so no one — including us — can read it. Keep it somewhere safe: without it you cannot clear the flag.",
  },
  {
    q: "How do I clear a flag once I recover my phone?",
    a: "Go to the Retrieve page, enter the same IMEI and the exact 3-word phrase you set when flagging. The flag is removed from the registry and buyers will see the device as clean again.",
  },
  {
    q: "Is checking an IMEI free?",
    a: "Yes. Searching the registry never requires an account and costs nothing. Flagging and retrieving are also gasless — Payless covers the network fee through account abstraction on Base.",
  },
  {
    q: "Who can see my phone's details?",
    a: "Only hashes are written on-chain. The registry stores a hash of the IMEI and a hash of your secret phrase — never the raw IMEI, never the phrase itself, and no personal information.",
  },
  {
    q: "What happens if a seller disputes a flag?",
    a: "A flagged result includes a dispute option. Disputes are reviewed against the on-chain record, and only the holder of the original 3-word phrase can clear the flag authoritatively.",
  },
];

export default function FaqPage() {
  return (
    <div className="page-wrap">
      <Navbar />
      <main
        style={{
          flex: 1,
          width: "100%",
          background: TOKENS.blue,
          padding: "150px 24px 96px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 780,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span className="tag-pill">FAQ&apos;s</span>

          <h1
            className="page-h1"
            style={{ textAlign: "center", marginTop: 22 }}
          >
            Frequently asked{" "}
            <span className="font-accent" style={{ color: TOKENS.white }}>
              questions
            </span>
            .
          </h1>

          <p
            style={{
              margin: "16px 0 40px",
              textAlign: "center",
              color: "rgba(255,255,255,0.85)",
              fontFamily: "var(--font-poppins), sans-serif",
              fontSize: 14,
              lineHeight: 1.6,
              maxWidth: 520,
            }}
          >
            Everything you need to know about flagging, retrieving, and checking a device
            on the Payless registry.
          </p>

          <FaqAccordion items={FAQ_ITEMS} />

          <div
            style={{
              marginTop: 44,
              width: "100%",
              background: TOKENS.cream,
              borderRadius: 28,
              padding: "32px 30px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontWeight: 600,
                  fontSize: 20,
                  letterSpacing: "-0.01em",
                  color: TOKENS.inkText,
                }}
              >
                Still need help?
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontSize: 13.5,
                  color: TOKENS.inkMuted,
                }}
              >
                Report a problem with a specific device and we&apos;ll take a look.
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                href="/search"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 48,
                  padding: "0 24px",
                  borderRadius: 999,
                  border: `1px solid ${TOKENS.ink}`,
                  color: TOKENS.inkText,
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Search IMEI
              </Link>
              <Link
                href="/flag"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 48,
                  padding: "0 24px",
                  borderRadius: 999,
                  background: TOKENS.ink,
                  color: TOKENS.cream,
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Report an issue
              </Link>
            </div>
          </div>

          <div style={{ marginTop: 56, width: "100%" }}>
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
