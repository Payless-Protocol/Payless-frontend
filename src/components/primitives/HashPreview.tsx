import { TOKENS } from "@/styles/tokens";

export function HashPreview({ hash }: { hash: `0x${string}` }) {
  const preview =
    hash.length > 10 ? `${hash.slice(0, 6)}…${hash.slice(-4)}` : hash;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily:
          'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
        fontSize: 12,
        color: TOKENS.body,
        background: "rgba(0,0,0,0.3)",
        borderRadius: 8,
        padding: "8px 12px",
        wordBreak: "break-all",
      }}
    >
      {preview}
    </span>
  );
}
