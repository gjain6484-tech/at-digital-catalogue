import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        bone: "var(--bone)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        paper: "var(--paper)",
        accent: "var(--accent)",
        "accent-dark": "var(--accent-dark)",
        "accent-soft": "var(--accent-soft)",
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        serif: ["Iowan Old Style", "Baskerville", "Times New Roman", "serif"],
        mono: ["SFMono-Regular", "SF Mono", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
