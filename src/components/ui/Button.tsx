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
    "border-transparent bg-accent text-text-primary shadow-[0_14px_34px_rgba(130,170,255,0.28)] hover:bg-accent-strong",
  ghost:
    "border border-text-primary/85 bg-transparent text-text-primary hover:border-text-primary hover:bg-text-primary/5",
  outline:
    "border border-text-primary/85 bg-transparent text-text-primary hover:border-text-primary hover:bg-text-primary/5",
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
        "inline-flex items-center justify-center gap-2 rounded-[10px] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60",
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
