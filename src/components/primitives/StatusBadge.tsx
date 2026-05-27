import { getStatusLabel, type DeviceStatus } from "@/lib/status";
import { TOKENS } from "@/styles/tokens";

export function StatusBadge({ status }: { status: DeviceStatus }) {
  const tone =
    status === 0
      ? {
          background: "rgba(34,197,94,0.12)",
          color: TOKENS.success,
          border: "rgba(34,197,94,0.24)",
        }
      : status === 1
        ? {
            background: "rgba(245,158,11,0.12)",
            color: "#f59e0b",
            border: "rgba(245,158,11,0.24)",
          }
        : {
            background: "rgba(74,124,247,0.12)",
            color: TOKENS.accent,
            border: "rgba(74,124,247,0.24)",
          };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        border: `1px solid ${tone.border}`,
        background: tone.background,
        color: tone.color,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        fontWeight: 700,
        padding: "6px 10px",
      }}
    >
      {getStatusLabel(status)}
    </span>
  );
}
