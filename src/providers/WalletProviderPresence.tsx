"use client";

import { createContext, useContext, type ReactNode } from "react";

const WalletProviderPresenceContext = createContext(false);

export function WalletProviderPresence({ children }: { children: ReactNode }) {
  return (
    <WalletProviderPresenceContext.Provider value={true}>
      {children}
    </WalletProviderPresenceContext.Provider>
  );
}

export function useWalletProviderPresent() {
  return useContext(WalletProviderPresenceContext);
}
