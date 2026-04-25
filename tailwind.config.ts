import type { Config } from "tailwindcss";

// Tailwind scans src/** for class usage.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
