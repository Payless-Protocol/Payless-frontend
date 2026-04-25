import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  rightSlot?: ReactNode;
}

export default function Input({
  label,
  helperText,
  error,
  rightSlot,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-2">
      {label ? (
        <span className="flex items-center justify-between text-sm font-medium text-white/90">
          <span>{label}</span>
          {rightSlot ? <span>{rightSlot}</span> : null}
        </span>
      ) : null}
      <input
        id={inputId}
        className={[
          "h-12 w-full rounded-[12px] border border-border-subtle bg-text-primary/5 px-4 text-sm text-text-primary placeholder:text-text-primary/30 outline-none transition focus:border-accent/50 focus:bg-text-primary/[0.08]",
          error ? "border-danger/60 focus:border-danger/70" : "",
          className,
        ].join(" ")}
        {...props}
      />
      {helperText ? <p className="text-xs text-white/45">{helperText}</p> : null}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </label>
  );
}
