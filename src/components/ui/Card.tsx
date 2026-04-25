import type { HTMLAttributes } from "react";

export default function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "rounded-[24px] border border-white/10 bg-white/[0.04] p-6 shadow-glow backdrop-blur-md",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
