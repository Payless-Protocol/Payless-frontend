'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';
import { getContractAddress, PAYLESS_ABI } from '@/lib/contract';
import { formatContractError } from '@/lib/contract';
import { hashIMEI, hashSecret } from '@/lib/hash';
import { ACTIVE_CHAIN_ID } from '@/lib/constants';
import { usePimlicTransaction } from '@/hooks/usePimlicTransaction';

export default function FlagGate() {
  const { address } = useAccount();
  const { authenticated } = usePrivy();
  const { sendSponsoredTransaction, loading, error } = usePimlicTransaction();

  const [imei, setImei] = useState('');
  const [word1, setWord1] = useState('');
  const [word2, setWord2] = useState('');
  const [word3, setWord3] = useState('');
  const [message, setMessage] = useState('');
  const [txHash, setTxHash] = useState('');

  const wordsValid = [word1, word2, word3].every((w) => w.trim().length >= 2);

  const handleFlagDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imei || !wordsValid) return;

    setMessage('');
    setTxHash('');

    try {
      if (!authenticated || !address) {
        throw new Error('❌ Please connect your wallet first.');
      }

      console.log('[FlagGate] Flagging device:', { imei });

      const imeiHash = hashIMEI(imei);
      const recoveryPhraseHash = hashSecret([word1, word2, word3].join(' '));

      const contractAddress = getContractAddress();
      if (!contractAddress) {
        throw new Error('❌ Contract address not configured.');
      }

      setMessage('⏳ Submitting transaction...');

      const { txHash: hash } = await sendSponsoredTransaction({
        contractAddress,
        abi: PAYLESS_ABI,
        functionName: 'flagDevice',
        args: [imeiHash, recoveryPhraseHash],
        chainId: ACTIVE_CHAIN_ID,
      });

      setTxHash(hash);
      setMessage(`✅ Device flagged successfully! TX: ${hash.substring(0, 10)}...`);

      // Reset form
      setImei('');
      setWord1('');
      setWord2('');
      setWord3('');

      console.log('[FlagGate] ✅ Device flagged:', hash);
    } catch (err) {
      const errorMsg = formatContractError(err, 'Failed to flag device');
      setMessage(`❌ ${errorMsg}`);
      console.error('[FlagGate] Error:', err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Flag Device</h1>
      <p style={{ color: '#888', fontSize: '12px', marginBottom: '20px' }}>
        ⛽ Gas sponsored by Pimlico • Zero cost to you
      </p>

      <form onSubmit={handleFlagDevice}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 600 }}>IMEI Number</label>
          <input
            type="text"
            value={imei}
            onChange={(e) => setImei(e.target.value)}
            placeholder="Enter 15-digit IMEI"
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              borderRadius: '6px',
              border: '1px solid #333',
              background: '#1A1A1A',
              color: '#fff',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 600 }}>Recovery Phrase (3 words)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '5px' }}>
            <input
              type="text"
              value={word1}
              onChange={(e) => setWord1(e.target.value)}
              placeholder="Word 1"
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #333',
                background: '#1A1A1A',
                color: '#fff',
              }}
            />
            <input
              type="text"
              value={word2}
              onChange={(e) => setWord2(e.target.value)}
              placeholder="Word 2"
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #333',
                background: '#1A1A1A',
                color: '#fff',
              }}
            />
            <input
              type="text"
              value={word3}
              onChange={(e) => setWord3(e.target.value)}
              placeholder="Word 3"
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #333',
                background: '#1A1A1A',
                color: '#fff',
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !wordsValid}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#666' : '#00F0FF',
            color: '#0F0F0F',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {loading ? '⏳ Flagging...' : '🚩 Flag Device'}
        </button>

        {message && (
          <div
            style={{
              marginTop: '15px',
              padding: '12px',
              borderRadius: '6px',
              background: message.includes('✅') ? '#1a3a1a' : '#3a1a1a',
              color: message.includes('✅') ? '#22C55E' : '#EF4444',
              fontSize: '13px',
            }}
          >
            {message}
          </div>
        )}

        {txHash && (
          <div
            style={{
              marginTop: '10px',
              padding: '10px',
              background: '#1A3A1A',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#22C55E',
              wordBreak: 'break-all',
            }}
          >
            <strong>TX Hash:</strong> {txHash}
            <br />
            <a
              href={`https://sepolia.basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#00F0FF', textDecoration: 'underline' }}
            >
              View on Block Explorer
            </a>
          </div>
        )}
      </form>
    </div>
  );
}
