"use client";

import { useEffect, useRef } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Providers } from "@/app/providers";
import AuthModal from "@/components/AuthModal";
import { useWalletProviderPresent } from "@/providers/WalletProviderPresence";

function AutoLogin({ enabled }: { enabled: boolean }) {
  const { ready, authenticated, login } = usePrivy();
  const openedRef = useRef(false);

  useEffect(() => {
    if (!enabled || openedRef.current || !ready || authenticated) {
      return;
    }

    openedRef.current = true;
    login();
  }, [authenticated, enabled, login, ready]);

  return null;
}

export default function AuthIsland({ autoOpen = false }: { autoOpen?: boolean }) {
  const providerPresent = useWalletProviderPresent();
  const content = (
    <>
      <AutoLogin enabled={autoOpen} />
      <AuthModal />
    </>
  );

  return providerPresent ? content : <Providers>{content}</Providers>;
}
