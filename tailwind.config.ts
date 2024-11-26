import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brown: {
          800: '#3E2723', // Add custom brown color
          700: '#6A4E23', // Dark brown
          500: '#8C5E3C', // Medium brown
        },
      },
    },
  },
  plugins: [],
};
export default config;
