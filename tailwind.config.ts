import type { Config } from "tailwindcss";

// Tailwind scans src/** for class usage.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      colors: {
        accent: "var(--accent)",
        bg: "var(--bg)",
        surface: "var(--surface)",
        success: "var(--success)",
        danger: "var(--danger)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(107, 143, 255, 0.12), 0 20px 60px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top right, rgba(107,143,255,0.26), transparent 35%), radial-gradient(circle at 20% 25%, rgba(107,143,255,0.12), transparent 22%)",
      },
    },
  },
  plugins: [],
};

export default config;
