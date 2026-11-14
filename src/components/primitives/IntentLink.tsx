"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, type AnchorHTMLAttributes, type MouseEvent, type FocusEvent, type TouchEvent, type ReactNode } from "react";

type IntentLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
};

export function IntentLink({ href, children, ...rest }: IntentLinkProps) {
  const router = useRouter();

  const prefetchOnIntent = useCallback(() => {
    void router.prefetch(href);
  }, [href, router]);

  const { onMouseEnter, onFocus, onTouchStart, ...anchorProps } = rest;

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      prefetchOnIntent();
      onMouseEnter?.(event);
    },
    [onMouseEnter, prefetchOnIntent]
  );

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLAnchorElement>) => {
      prefetchOnIntent();
      onFocus?.(event);
    },
    [onFocus, prefetchOnIntent]
  );

  const handleTouchStart = useCallback(
    (event: TouchEvent<HTMLAnchorElement>) => {
      prefetchOnIntent();
      onTouchStart?.(event);
    },
    [onTouchStart, prefetchOnIntent]
  );

  return (
    <Link
      href={href}
      prefetch={false}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      onTouchStart={handleTouchStart}
      {...anchorProps}
    >
      {children}
    </Link>
  );
}
