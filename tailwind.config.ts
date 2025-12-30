import type { Config } from "tailwindcss";
import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        "primary-light": "#6366f1",
        "primary-hover": "#4338ca",
        "background-light": "#F3F4F6",
        "background-dark": "#111827",
        "surface-light": "#FFFFFF",
        "surface-dark": "#1F2937",
        "border-light": "#E5E7EB",
        "border-dark": "#374151",
        "text-light": "#111827",
        "text-secondary-light": "#6B7280",
        "text-dark": "#F9FAFB",
        "text-secondary-dark": "#9CA3AF",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        'card-drag': '0 25px 50px -12px rgba(79, 70, 229, 0.35), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [
    forms,
    containerQueries,
  ],
};
export default config;