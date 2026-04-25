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
    "border-transparent bg-gradient-to-r from-accent to-accent-strong text-text-primary shadow-[0_14px_34px_rgba(107,143,255,0.24)] hover:opacity-90",
  ghost:
    "border border-border-strong bg-transparent text-text-primary hover:border-text-primary/50 hover:bg-text-primary/5",
  outline:
    "border border-border-strong bg-text-primary/5 text-text-primary hover:border-text-primary/40 hover:bg-text-primary/10",
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
