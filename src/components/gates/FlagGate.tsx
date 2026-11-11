"use client";

import { useState, useRef, useEffect, type CSSProperties, type FormEvent } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { getContractAddress, PAYLESS_ABI, formatContractError } from "@/lib/contract";
import { hashIMEI, hashSecret, validateIMEI, validateWord } from "@/lib/hash";
import { ACTIVE_CHAIN_ID, getActiveChain } from "@/lib/constants";
import { getTxUrl } from "@/lib/basescan";
import { useGaslessTransaction } from "@/hooks/usePimlicTransaction";
import { TOKENS } from "@/styles/tokens";

const fieldStyle: CSSProperties = {
  width: "100%",
  height: 56,
  padding: 14,
  borderRadius: 20,
  border: "2px solid #000000",
  background: "transparent",
  color: TOKENS.inkText,
  fontFamily: "var(--font-poppins), sans-serif",
  fontSize: 16,
  fontWeight: 500,
  lineHeight: "24px",
};

const labelStyle: CSSProperties = {
  display: "block",
  margin: 0,
  color: TOKENS.inkText,
  fontFamily: "var(--font-poppins), sans-serif",
  fontSize: 16,
  fontWeight: 500,
  lineHeight: "24px",
};

const helperStyle: CSSProperties = {
  margin: "10px 0 0",
  color: "rgba(24,26,24,0.75)",
  fontFamily: "var(--font-poppins), sans-serif",
  fontSize: 12,
  fontWeight: 500,
  lineHeight: "18px",
};

const cardShellStyle: CSSProperties = {
  width: "100%",
  maxWidth: 547,
  background: TOKENS.ink,
  borderRadius: 25,
  paddingLeft: 5,
};

const cardInnerStyle: CSSProperties = {
  width: "100%",
  background: TOKENS.cream,
  borderRadius: 25,
  padding: "clamp(20px, 2.1vw, 30px)",
};

function MacDots() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flex: "0 0 auto" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 15,
            height: 15,
            borderRadius: "50%",
            background: TOKENS.ink,
            display: "inline-block",
          }}
        />
      ))}
    </div>
  );
}

export default function FlagGate() {
  const { authenticated, login } = usePrivy();
  const { sendGaslessTransaction } = useGaslessTransaction();
  const [imei, setImei] = useState("");
  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  const [word3, setWord3] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
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
      <div style={cardShellStyle}>
        <div style={{ ...cardInnerStyle, textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-poppins), sans-serif",
              fontWeight: 600,
              fontSize: 20,
              color: TOKENS.inkText,
            }}
          >
            Connect to flag a device
          </h2>
          <p
            style={{
              margin: "10px 0 20px",
              color: "rgba(24,26,24,0.75)",
              fontFamily: "var(--font-poppins), sans-serif",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "21px",
            }}
          >
            Please log in first to flag a device.
          </p>
          <button
            type="button"
            onClick={() => login()}
            style={{
              width: "100%",
              height: 52,
              borderRadius: 16,
              border: "none",
              background: TOKENS.ink,
              color: TOKENS.cream,
              fontFamily: "var(--font-poppins), sans-serif",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  const handleFlagDevice = (e: FormEvent) => {
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

    void submitFlag();
  };

  const submitFlag = async () => {
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
        functionName: "flagDevice",
        args: [imeiHash, secretHash],
        chain,
      });

      setTxHash(hash);
      setMessage("Device successfully flagged!");

      resetTimerRef.current = setTimeout(() => {
        setImei("");
        setWord1("");
        setWord2("");
        setWord3("");
      }, 2000);
    } catch (error: unknown) {
      setMessage(formatContractError(error, "Failed to flag device. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={cardShellStyle}>
        <div style={cardInnerStyle}>
          <form onSubmit={handleFlagDevice} style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 24 }}>
                <label style={labelStyle} htmlFor="flag-imei-input">15-Digit IMEI</label>
                <MacDots />
              </div>
              <input
                id="flag-imei-input"
                name="imei"
                className="payless-field"
                type="text"
                inputMode="numeric"
                maxLength={15}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                disabled={loading}
                value={imei}
                onChange={(e) => setImei(e.target.value.replace(/\D/g, "").slice(0, 15))}
                placeholder="Enter a 15-digit IMEI to flag your device"
                style={{ ...fieldStyle, marginTop: 30 }}
              />
            </div>

              <div>
                <div>
                  <label style={labelStyle} htmlFor="flag-phrase-label">Secret Recovery Phrase (3 words)</label>
                  <p style={helperStyle}>
                    Choose 3 words. Order matters — you&apos;ll need the exact same words and
                    order to unflag later.
                  </p>
                </div>
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
                    className="flag-word-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      gap: 20,
                      marginTop: 20,
                    }}
                  >
                    <input
                      id="flag-word1-input"
                      name="word1"
                      className="payless-field"
                      type="text"
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      disabled={loading}
                      value={word1}
                      onChange={(e) => setWord1(e.target.value)}
                      placeholder="Word 1"
                      style={fieldStyle}
                    />
                    <input
                      id="flag-word2-input"
                      name="word2"
                      className="payless-field"
                      type="text"
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      disabled={loading}
                      value={word2}
                      onChange={(e) => setWord2(e.target.value)}
                      placeholder="Word 2"
                      style={fieldStyle}
                    />
                    <input
                      id="flag-word3-input"
                      name="word3"
                      className="payless-field"
                      type="text"
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      disabled={loading}
                      value={word3}
                      onChange={(e) => setWord3(e.target.value)}
                      placeholder="Word 3"
                      style={fieldStyle}
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
                padding: "14px 18px",
                borderRadius: 16,
                border: "none",
                background: TOKENS.ink,
                color: TOKENS.cream,
                fontFamily: "var(--font-poppins), sans-serif",
                fontSize: 16,
                fontWeight: 600,
                lineHeight: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: loading || !imei || !wordsValid ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Processing..." : "Flag Device"}
            </button>
          </form>
        </div>
      </div>

      {txHash ? (
        <div role="status" aria-live="polite" style={{ ...cardShellStyle, marginTop: 25 }}>
          <div style={{ ...cardInnerStyle, textAlign: "center", animation: "toast-in 0.25s ease" }}>
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
            <div style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 600, fontSize: 16, color: TOKENS.inkText }}>
              Device successfully flagged!
            </div>
            <div style={{ marginTop: 8, color: "rgba(24,26,24,0.75)", fontFamily: "var(--font-poppins), sans-serif", fontSize: 12, lineHeight: "18px" }}>
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
        </div>
      ) : message && !txHash ? (
        <p
          role="alert"
          aria-live="assertive"
          className="overflow-anywhere"
          style={{
            width: "100%",
            maxWidth: 547,
            marginTop: 14,
            color: TOKENS.white,
            fontFamily: "var(--font-poppins), sans-serif",
            fontSize: 13,
            lineHeight: "19.5px",
            textAlign: "center",
          }}
        >
          {message}
        </p>
      ) : null}
    </>
  );
}
