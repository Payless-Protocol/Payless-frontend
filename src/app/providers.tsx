'use client';

import { ReactNode } from 'react';
import { PrivyProvider } from "@/providers/PrivyProvider";
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function Providers({ children, silent = false }: { children: ReactNode; silent?: boolean }) {
  return (
    <ErrorBoundary silent={silent}>
      <PrivyProvider>{children}</PrivyProvider>
    </ErrorBoundary>
  );
}
