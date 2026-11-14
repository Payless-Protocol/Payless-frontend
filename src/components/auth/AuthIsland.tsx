"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Providers } from "@/app/providers";
import AuthModal from "@/components/AuthModal";
import { useWalletProviderPresent } from "@/providers/WalletProviderPresence";
import { ensureHcaptchaReady } from "@/lib/hcaptchaLoader";

let autoOpenedThisPage = false;

function AutoLogin({ enabled }: { enabled: boolean }) {
  const { ready, authenticated, login } = usePrivy() as {
    ready: boolean;
    authenticated: boolean;
    login: () => void;
  };

  useEffect(() => {
    if (!enabled || autoOpenedThisPage || !ready || authenticated) {
      return;
    }

    autoOpenedThisPage = true;
    login();
  }, [authenticated, enabled, login, ready]);

  return null;
}

export default function AuthIsland({ autoOpen = false }: { autoOpen?: boolean }) {
  const providerPresent = useWalletProviderPresent();
  const [hcaptchaReady, setHcaptchaReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ensureHcaptchaReady().then(() => {
      if (!cancelled) {
        setHcaptchaReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const content = (
    <>
      <AutoLogin enabled={autoOpen} />
      <AuthModal />
    </>
  );

  if (providerPresent) {
    return content;
  }

  if (!hcaptchaReady) {
    return null;
  }

  return <Providers silent>{content}</Providers>;
}
