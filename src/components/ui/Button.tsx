import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "accent" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  accent:
    "border-transparent bg-gradient-to-r from-[#6b8fff] to-[#8aa3ff] text-white shadow-[0_14px_34px_rgba(107,143,255,0.24)] hover:opacity-90",
  ghost:
    "border border-white/20 bg-transparent text-white hover:border-white/50 hover:bg-white/5",
  outline:
    "border border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[14px]",
  lg: "h-12 px-6 text-[15px]",
};

export default function Button({
  children,
  variant = "accent",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-[10px] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6b8fff]/40 focus:ring-offset-0",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
