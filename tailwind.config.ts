import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7fb",
          100: "#d6ecf5",
          200: "#b6dfee",
          300: "#8dcfe4",
          400: "#5eb8d6",
          500: "#3298c1",
          600: "#2b7aa2",
          700: "#246485",
          800: "#1f536c",
          900: "#1a4358",
        },
      },
    },
  },
  plugins: [],
};

export default config;
