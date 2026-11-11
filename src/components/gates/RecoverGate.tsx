"use client";

import { useState, useRef, useEffect, type CSSProperties, type FormEvent } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { getContractAddress, PAYLESS_ABI, formatContractError } from "@/lib/contract";
import { hashIMEI, hashSecret, validateIMEI, validateWord } from "@/lib/hash";
import { ACTIVE_CHAIN_ID, getActiveChain } from "@/lib/constants";
import { getTxUrl } from "@/lib/basescan";
import { useGaslessTransaction } from "@/hooks/usePimlicTransaction";
import { TOKENS } from "@/styles/tokens";

const inputStyle: CSSProperties = {
  width: "100%",
  height: 48,
  padding: "0 14px",
  borderRadius: 10,
  border: "1px solid rgba(24,26,24,0.35)",
  background: "#E4E1DB",
  color: TOKENS.inkText,
  fontFamily: "var(--font-poppins), sans-serif",
  fontSize: 14,
};

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: 8,
  color: TOKENS.inkText,
  fontFamily: "var(--font-poppins), sans-serif",
  fontSize: 13,
  fontWeight: 600,
};

function MacDots() {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "rgba(24,26,24,0.55)",
            display: "inline-block",
          }}
        />
      ))}
    </div>
  );
}

export default function RecoverGate() {
  const { authenticated, login } = usePrivy();
  const { sendGaslessTransaction } = useGaslessTransaction();
  const [imei, setImei] = useState("");
  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  const [word3, setWord3] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear pending reset timer on unmount to avoid state updates after unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const wordsValid = [word1, word2, word3].every((w) => w.trim().length >= 2);

  if (!authenticated) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: TOKENS.cream,
          borderRadius: 22,
          padding: "26px 24px",
          textAlign: "center",
          boxShadow: "0 24px 50px rgba(11,22,76,0.18)",
        }}
      >
        <h2 style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 700, fontSize: 18, color: TOKENS.inkText }}>
          Connect to retrieve a device
        </h2>
        <p style={{ margin: "10px 0 20px", color: TOKENS.inkMuted, fontFamily: "var(--font-poppins), sans-serif", fontSize: 13.5, lineHeight: 1.6 }}>
          Please log in first to recover a device.
        </p>
        <button
          type="button"
          onClick={() => login()}
          style={{
            width: "100%",
            height: 52,
            borderRadius: 12,
            border: "none",
            background: TOKENS.ink,
            color: TOKENS.white,
            fontFamily: "var(--font-poppins), sans-serif",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Login Now
        </button>
      </div>
    );
  }

  const handleUnflagDevice = (e: FormEvent) => {
    e.preventDefault();
    if (!imei || !wordsValid) return;

    if (!validateIMEI(imei)) {
      setMessage("IMEI must be exactly 15 digits (no spaces or dashes).");
      setLoading(false);
      return;
    }

    const words = [word1, word2, word3];
    if (!words.every(validateWord)) {
      setMessage("Each word must be 2+ letters (no numbers or special characters).");
      setLoading(false);
      return;
    }

    setShowConfirm(true);
  };

  const confirmAndSubmit = async () => {
    setShowConfirm(false);
    setLoading(true);
    setMessage("");
    setTxHash(null);

    try {
      const chain = getActiveChain();

      if (ACTIVE_CHAIN_ID !== 84532 && ACTIVE_CHAIN_ID !== 8453) {
        throw new Error(`Invalid chain ID: ${ACTIVE_CHAIN_ID}. Expected Base Sepolia (84532) or Base (8453).`);
      }

      const contractAddress = getContractAddress(ACTIVE_CHAIN_ID);
      const imeiHash = hashIMEI(imei.trim());
      const secretHash = hashSecret([word1, word2, word3]);

      const { txHash: hash } = await sendGaslessTransaction({
        contractAddress,
        abi: PAYLESS_ABI,
        functionName: "unflagDevice",
        args: [imeiHash, secretHash],
        chain,
      });

      setTxHash(hash);
      setMessage("Device successfully unflagged!");

      resetTimerRef.current = setTimeout(() => {
        setImei("");
        setWord1("");
        setWord2("");
        setWord3("");
      }, 2000);
    } catch (error: unknown) {
      setMessage(formatContractError(error, "Failed to clear device. Please verify credentials."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: TOKENS.cream,
          borderRadius: 22,
          padding: "20px 22px 22px",
          boxShadow: "0 24px 50px rgba(11,22,76,0.18)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 700, fontSize: 14, color: TOKENS.inkText }}>
            Recover / Unflag Device
          </span>
          <MacDots />
        </div>

        <form onSubmit={handleUnflagDevice} style={{ marginTop: 16 }}>
          <div>
            <label style={labelStyle} htmlFor="recover-imei-input">15-Digit IMEI</label>
            <input
              id="recover-imei-input"
              name="imei"
              type="text"
              inputMode="numeric"
              maxLength={15}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              disabled={loading}
              value={imei}
              onChange={(e) => setImei(e.target.value.replace(/\D/g, "").slice(0, 15))}
              placeholder="Enter a 15-digit IMEI to retrieve your device"
              style={inputStyle}
            />
          </div>

          <div style={{ marginTop: 18 }}>
            <label style={labelStyle} htmlFor="recover-phrase-label">Secret Recovery Phrase (3 words)</label>
            <p style={{ margin: "0 0 10px", color: TOKENS.inkMuted, fontFamily: "var(--font-poppins), sans-serif", fontSize: 11.5, lineHeight: 1.5 }}>
              Enter the exact 3 words you used when flagging this device. Order matters.
            </p>
            <fieldset
              style={{
                border: "none",
                margin: 0,
                padding: 0,
                display: "block",
              }}
            >
              <legend className="sr-only" style={{ marginBottom: 8 }}>
                Secret Recovery Phrase (3 words)
              </legend>
              <div
                className="recover-word-row"
                style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}
              >
                <input
                  id="recover-word1-input"
                  name="word1"
                  type="text"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  disabled={loading}
                  value={word1}
                  onChange={(e) => setWord1(e.target.value)}
                  placeholder="Word 1"
                  style={inputStyle}
                />
                <input
                  id="recover-word2-input"
                  name="word2"
                  type="text"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  disabled={loading}
                  value={word2}
                  onChange={(e) => setWord2(e.target.value)}
                  placeholder="Word 2"
                  style={inputStyle}
                />
                <input
                  id="recover-word3-input"
                  name="word3"
                  type="text"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  disabled={loading}
                  value={word3}
                  onChange={(e) => setWord3(e.target.value)}
                  placeholder="Word 3"
                  style={inputStyle}
                />
              </div>
            </fieldset>
          </div>

          <button
            type="submit"
            disabled={loading || !imei || !wordsValid}
            style={{
              width: "100%",
              height: 52,
              marginTop: 20,
              borderRadius: 12,
              border: "none",
              background: TOKENS.ink,
              color: TOKENS.white,
              fontFamily: "var(--font-poppins), sans-serif",
              fontSize: 15,
              fontWeight: 600,
              cursor: loading || !imei || !wordsValid ? "not-allowed" : "pointer",
              opacity: loading || !imei || !wordsValid ? 0.5 : 1,
            }}
          >
            {loading ? "Processing..." : "Retrieve Device"}
          </button>
        </form>
      </div>

      {showConfirm ? (
        <div
          style={{
            width: "100%",
            maxWidth: 460,
            marginTop: 16,
            background: TOKENS.cream,
            borderRadius: 22,
            padding: "20px 22px",
            boxShadow: "0 24px 50px rgba(11,22,76,0.18)",
          }}
        >
          <h3 style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 700, fontSize: 16, color: TOKENS.inkText }}>
            Confirm Recover Device
          </h3>
          <p style={{ margin: "10px 0 6px", color: TOKENS.inkMuted, fontFamily: "var(--font-poppins), sans-serif", fontSize: 13 }}>
            You are about to recover/unflag device with IMEI:{" "}
            <span style={{ fontFamily: "ui-monospace, monospace", color: TOKENS.inkText }}>{imei}</span>
          </p>
          <p style={{ margin: "0 0 16px", color: TOKENS.inkMuted, fontFamily: "var(--font-poppins), sans-serif", fontSize: 11.5, lineHeight: 1.5 }}>
            This action writes to the blockchain. Make sure you have the correct recovery phrase.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              style={{
                flex: 1,
                height: 46,
                borderRadius: 10,
                border: "1px solid rgba(24,26,24,0.4)",
                background: "transparent",
                color: TOKENS.inkText,
                fontFamily: "var(--font-poppins), sans-serif",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmAndSubmit}
              disabled={loading}
              style={{
                flex: 1,
                height: 46,
                borderRadius: 10,
                border: "none",
                background: TOKENS.ink,
                color: TOKENS.white,
                fontFamily: "var(--font-poppins), sans-serif",
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Processing..." : "Confirm & Recover"}
            </button>
          </div>
        </div>
      ) : null}

      {txHash ? (
        <div role="status" aria-live="polite"
          style={{
            width: "100%",
            maxWidth: 460,
            marginTop: 16,
            background: TOKENS.cream,
            borderRadius: 22,
            padding: "22px",
            textAlign: "center",
            boxShadow: "0 24px 50px rgba(11,22,76,0.18)",
            animation: "toast-in 0.25s ease",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              margin: "0 auto 12px",
              borderRadius: "50%",
              background: "rgba(30,62,217,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: TOKENS.blue,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 700, fontSize: 16, color: TOKENS.inkText }}>
            Device successfully unflagged!
          </div>
          <div style={{ marginTop: 8, color: TOKENS.inkMuted, fontFamily: "var(--font-poppins), sans-serif", fontSize: 12 }}>
            Tx Hash:{" "}
            <a
              href={getTxUrl(txHash, ACTIVE_CHAIN_ID)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: TOKENS.blue, wordBreak: "break-all" }}
            >
              {txHash.slice(0, 18)}…{txHash.slice(-6)}
            </a>
          </div>
        </div>
      ) : message && !txHash ? (
        <p role="alert" aria-live="assertive" className="overflow-anywhere" style={{ width: "100%", maxWidth: 460, marginTop: 14, color: TOKENS.white, fontFamily: "var(--font-poppins), sans-serif", fontSize: 13, lineHeight: 1.6 }}>
          {message}
        </p>
      ) : null}

      <div
        style={{
          marginTop: 26,
          color: "rgba(255,255,255,0.72)",
          fontFamily: "var(--font-poppins), sans-serif",
          fontSize: 12.5,
        }}
      >
        Built on <span style={{ fontWeight: 700, color: TOKENS.ink }}>Base</span>
        <span style={{ color: TOKENS.white }}>.</span>
      </div>
    </>
  );
}
