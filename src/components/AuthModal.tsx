'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';
import { useEffect, useMemo, useState } from 'react';

function SignOutIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function AuthModal() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { address } = useAccount();
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (ready) {
      // Small delay to let authenticated state stabilize after ready flips true
      const timer = setTimeout(() => setSettled(true), 300);
      return () => clearTimeout(timer);
    }
  }, [ready]);

  useEffect(() => {
    if (ready) {
      console.log('[AuthModal] ✅ Auth state updated:', {
        authenticated,
        address: address ? address.substring(0, 6) + '...' : 'NOT CONNECTED',
        userEmail: user?.email?.address || 'none',
      });
    }
  }, [ready, authenticated, address, user]);

  const shortenedAddress = useMemo(() => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`.toUpperCase();
  }, [address]);

  if (!ready || !settled) {
    return (
      <div
        style={{
          padding: '8px 12px',
          background: '#1A1A1A',
          borderRadius: 8,
          color: '#888',
          fontSize: 12,
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      {authenticated && address ? (
        <>
          <span
            style={{
              padding: '8px 12px',
              background: '#1A1A1A',
              borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: '#00F0FF',
              fontWeight: 600,
            }}
          >
            {shortenedAddress}
          </span>
          <button
            onClick={() => {
              logout();
              console.log('[AuthModal] ✅ User logged out');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: '#3B82F6',
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#2563EB')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#3B82F6')}
          >
            Sign Out <SignOutIcon size={14} />
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            console.log('[AuthModal] Opening login modal');
            login();
          }}
          style={{
            padding: '10px 20px',
            background: '#00F0FF',
            border: 'none',
            borderRadius: 10,
            color: '#0F0F0F',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#00D9E8')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#00F0FF')}
        >
          Connect
        </button>
      )}
    </div>
  );
}
