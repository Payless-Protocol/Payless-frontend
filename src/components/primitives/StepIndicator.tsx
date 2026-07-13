import { TOKENS } from "@/styles/tokens";

export function StepIndicator({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {steps.map((step, index) => {
        const active = index === currentStep;
        const complete = index < currentStep;

        return (
          <div
            key={step}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 999,
              border: `1px solid ${
                active
                  ? TOKENS.accent
                  : complete
                    ? "rgba(34,197,94,0.35)"
                    : TOKENS.borderSubtle
              }`,
              background: active
                ? "rgba(74,124,247,0.12)"
                : complete
                  ? "rgba(34,197,94,0.08)"
                  : TOKENS.surface,
              padding: "8px 12px",
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: active || complete ? "#fff" : TOKENS.body,
                background: active
                  ? TOKENS.accent
                  : complete
                    ? "rgba(34,197,94,0.45)"
                    : "rgba(255,255,255,0.08)",
              }}
            >
              {index + 1}
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                color: active ? TOKENS.heading : TOKENS.body,
                whiteSpace: "nowrap",
              }}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
