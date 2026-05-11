import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3B5295",
        primaryDark: "#30447c",
        accent: "#C9A84C",
        accentLight: "#E8C96A",
        background: "#F4F7F9",
        surface: "#FFFFFF",
        border: "#E2E8F0",
        textPrimary: "#1A202C",
        textSecondary: "#4A5568",
        success: "#2F855A",
        warning: "#C05621",
        danger: "#C53030",
        info: "#2B6CB0"
      },
      borderRadius: {
        app: "8px"
      },
      boxShadow: {
        enterprise: "0 10px 30px rgba(15, 35, 71, 0.08)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
