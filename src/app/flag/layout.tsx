import type { ReactNode } from "react";
import { Providers } from "../providers";
import { WalletProviderPresence } from "@/providers/WalletProviderPresence";

export default function FlagLayout({ children }: { children: ReactNode }) {
  return (
    <WalletProviderPresence>
      <Providers>{children}</Providers>
    </WalletProviderPresence>
  );
}
