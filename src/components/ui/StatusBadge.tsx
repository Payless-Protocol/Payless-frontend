import type { DeviceStatus } from "@/types";

interface StatusBadgeProps {
  status: DeviceStatus;
  className?: string;
}

const statusStyles: Record<DeviceStatus, string> = {
  clean: "bg-success/15 text-success ring-success/20",
  flagged: "bg-danger/15 text-danger ring-danger/20",
};

export default function StatusBadge({
  status,
  className = "",
}: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ring-1",
        statusStyles[status],
        className,
      ].join(" ")}
    >
      <span className="mr-2 h-2 w-2 rounded-full bg-current" />
      {status === "clean" ? "Clean" : "Flagged"}
    </span>
  );
}
