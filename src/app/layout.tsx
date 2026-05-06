import type { ReactNode } from "react";

export const metadata = {
  title: "Payless Protocol",
  description: "Payless Protocol landing page",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
