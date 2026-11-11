import type { Config } from "tailwindcss";

// Tailwind scans src/** for class usage.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-bricolage)", "sans-serif"],
        sans: ["var(--font-poppins)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        body: ["var(--font-poppins)", "sans-serif"],
        accent: ["var(--font-playfair)", "serif"],
      },
      colors: {
        blue: {
          DEFAULT: "#1E3ED9",
          hover: "#1B38C3",
          active: "#1832AE",
          dark: "#172FA3",
          darker: "#0B164C",
          light: "#E9ECFB",
        },
        cream: "#CBC8C5",
        ink: "#181A18",
        clean: "#95C88B",
        flagged: "#C88B8B",
        notfound: "#D3BD80",
        danger: "#A92626",
      },
      borderRadius: {
        card: "28px",
      },
      boxShadow: {
        card: "0 24px 60px rgba(11, 22, 76, 0.18)",
        pill: "0 12px 28px rgba(11, 22, 76, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
