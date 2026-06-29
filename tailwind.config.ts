import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171b1c",
        dusk: "#20282f",
        sandstone: "#c59a68",
        parchment: "#ead9b5",
        oldgold: "#c8a463",
        ember: "#9a5937",
      },
      fontFamily: {
        serif: [
          "Iowan Old Style",
          "Palatino Linotype",
          "Noto Serif SC",
          "Songti SC",
          "serif",
        ],
        sans: [
          "Inter",
          "Noto Sans SC",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif",
        ],
      },
      boxShadow: {
        "gold-glow": "0 0 28px rgba(216, 177, 100, 0.25)",
        "deep-panel": "0 24px 80px rgba(0, 0, 0, 0.42)",
      },
    },
  },
  plugins: [],
};

export default config;
