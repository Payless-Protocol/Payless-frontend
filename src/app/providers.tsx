'use client';

import { ReactNode } from 'react';
import { PrivyProvider } from "@/providers/PrivyProvider";
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <PrivyProvider>{children}</PrivyProvider>
    </ErrorBoundary>
  );
}
