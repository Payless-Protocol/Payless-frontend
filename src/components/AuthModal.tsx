'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useDisconnect } from 'wagmi';
import { useEffect, useState, useMemo } from 'react';

function SignOutIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

export default function AuthModal() {
  const { login, logout, authenticated, ready } = usePrivy();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const shortenedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`.toUpperCase();
  }, [address]);

  if (!ready) return null;

  const handleLogout = () => {
    logout();
    disconnect();
  };

  if (authenticated && isConnected) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {!isMobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: 100,
            color: '#fff',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} />
            {shortenedAddress}
          </div>
        )}
        <button
          onClick={handleLogout}
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
          onMouseOver={(e) => e.currentTarget.style.background = '#2563EB'}
          onMouseOut={(e) => e.currentTarget.style.background = '#3B82F6'}
        >
          Sign Out <SignOutIcon size={14} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {!isMobile && (
        <button
          onClick={login}
          style={{
            padding: '10px 22px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 100,
            color: '#fff',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
        >
          Sign Up
        </button>
      )}
      <button
        onClick={login}
        style={{
          padding: '10px 22px',
          background: '#3B82F6',
          border: 'none',
          borderRadius: 100,
          color: '#fff',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'background 0.2s ease',
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#2563EB'}
        onMouseOut={(e) => e.currentTarget.style.background = '#3B82F6'}
      >
        Login Now
      </button>
    </div>
  );
}
