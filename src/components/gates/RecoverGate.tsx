"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { getContractAddress, PAYLESS_ABI, formatContractError } from "@/lib/contract";
import { hashIMEI, hashSecret, validateIMEI, validateWord } from "@/lib/hash";
import { ACTIVE_CHAIN_ID, getActiveChain } from "@/lib/constants";
import { getTxUrl } from "@/lib/basescan";
import { useGaslessTransaction } from "@/hooks/usePimlicTransaction";
import { TOKENS } from "@/styles/tokens";
import { ShieldIllustration } from "@/components/primitives/Illustrations";
import SigningOverlay from "@/components/gates/SigningOverlay";

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

export default function RecoverGate() {
  const { authenticated, login } = usePrivy();
  const { sendGaslessTransaction } = useGaslessTransaction();
  const [imei, setImei] = useState("");
  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  const [word3, setWord3] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSigning, setShowSigning] = useState(false);

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
            Connect to retrieve a device
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
            Please log in first to recover a device.
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

  const handleUnflagDevice = (e: FormEvent) => {
    e.preventDefault();
    if (!imei || !wordsValid) return;

    if (!validateIMEI(imei)) {
      setMessage("IMEI must be exactly 15 digits (no spaces or dashes).");
      return;
    }

    const words = [word1, word2, word3];
    if (!words.every(validateWord)) {
      setMessage("Each word must be 2+ letters (no numbers or special characters).");
      return;
    }

    setShowConfirm(true);
  };

  const submitUnflag = async () => {
    setShowSigning(false);
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

      // Success screen shows the form back at its empty placeholder state
      setImei("");
      setWord1("");
      setWord2("");
      setWord3("");
      setShowConfirm(false);
    } catch (error: unknown) {
      setMessage(formatContractError(error, "Failed to clear device. Please verify credentials."));
    } finally {
      setLoading(false);
    }
  };

  const signingMessage = imei.trim() ? hashIMEI(imei.trim()) : "";

  return (
    <>
      <div style={cardShellStyle}>
        <div style={cardInnerStyle}>
          <form onSubmit={handleUnflagDevice} style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 24 }}>
              <span style={labelStyle}>Recover / Unflag Device</span>
              <MacDots />
            </div>
            <input
              id="recover-imei-input"
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
              placeholder="Enter a 15-digit IMEI to retrieve your device"
              aria-label="15-digit IMEI"
              style={{ ...fieldStyle, marginTop: 30 }}
            />

            <div style={{ marginTop: 30 }}>
              <label style={labelStyle} htmlFor="recover-word1-input">
                Secret Recovery Phrase (3 words)
              </label>
              <p style={helperStyle}>
                Enter the exact 3 words you used when flagging this device. Order matters.
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
                className="recover-word-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 20,
                  marginTop: 20,
                }}
              >
                <input
                  id="recover-word1-input"
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
                  id="recover-word2-input"
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
                  id="recover-word3-input"
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

            <button
              type="submit"
              disabled={loading || !imei || !wordsValid}
              style={{
                width: "100%",
                height: 52,
                marginTop: 30,
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
              {loading ? "Processing..." : "Retrieve Device"}
            </button>
          </form>

          {/* Inline confirmation panel (section 8.4 equivalent: 482 × 191,
              #B6B6B6, radius 16, padding 21/15) */}
          {showConfirm && !loading ? (
            <div
              style={{
                marginTop: 30,
                background: TOKENS.confirmGray,
                borderRadius: 16,
                padding: "21px 15px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--font-playfair), serif",
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: TOKENS.inkText,
                }}
              >
                Confirm Recover Device
              </h3>
              <p
                style={{
                  margin: "10px 0 0",
                  color: "rgba(24,26,24,0.75)",
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: "18px",
                }}
              >
                You are about to recover/unflag device with IMEI:{" "}
                <span style={{ color: TOKENS.inkText }}>{imei}</span>
              </p>
              <p
                style={{
                  margin: "10px 0 0",
                  color: "rgba(24,26,24,0.75)",
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontSize: 10,
                  fontWeight: 500,
                  lineHeight: "15px",
                }}
              >
                This action writes to the blockchain. Make sure you have the correct recovery
                phrase.
              </p>
              <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 16,
                    border: "none",
                    background: TOKENS.danger,
                    color: TOKENS.cream,
                    fontFamily: "var(--font-poppins), sans-serif",
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: "24px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirm(false);
                    setShowSigning(true);
                  }}
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 16,
                    border: "none",
                    background: TOKENS.ink,
                    color: TOKENS.cream,
                    fontFamily: "var(--font-poppins), sans-serif",
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: "24px",
                    cursor: "pointer",
                  }}
                >
                  Confirm &amp; Recover
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Signing overlay (section 8.5) */}
      {showSigning ? (
        <SigningOverlay message={signingMessage} onSign={submitUnflag} signing={loading} />
      ) : null}

      {txHash ? (
        /* Success card (green 5px left edge, cloud inner, radius 25, padding 20/30) */
        <div
          role="status"
          aria-live="polite"
          style={{ ...cardShellStyle, background: TOKENS.clean, marginTop: 25 }}
        >
          <div style={{ ...cardInnerStyle, padding: "20px clamp(20px, 2.1vw, 30px)", textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-poppins), sans-serif",
                fontWeight: 600,
                fontSize: 16,
                lineHeight: "24px",
                color: "#000000",
              }}
            >
              Device successfully unflagged!
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 25 }}>
              <ShieldIllustration />
            </div>
            <div
              className="overflow-anywhere"
              style={{
                marginTop: 25,
                color: TOKENS.inkText,
                fontFamily: "var(--font-poppins), sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: "21px",
                textAlign: "center",
              }}
            >
              Tx Hash:{" "}
              <a
                href={getTxUrl(txHash, ACTIVE_CHAIN_ID)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: TOKENS.inkText, textDecoration: "none", wordBreak: "break-all" }}
              >
                {txHash}
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

      {/* Attribution (16/24, 608 box, white 75% + Dark "Base") */}
      <div
        style={{
          width: "100%",
          maxWidth: 608,
          marginTop: 25,
          textAlign: "center",
          color: "rgba(255,255,255,0.75)",
          fontFamily: "var(--font-poppins), sans-serif",
          fontWeight: 500,
          fontSize: 16,
          lineHeight: "24px",
        }}
      >
        Built on <span style={{ color: TOKENS.ink }}>Base</span>
        <span>.</span>
      </div>
    </>
  );
}
