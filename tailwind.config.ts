import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#0f172a",
          800: "#1e3a8a",
          600: "#0284c7",
          100: "#e0f2fe",
        },
      },
    },
  },
  plugins: [],
};

export default config;
