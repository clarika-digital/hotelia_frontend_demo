import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#223047",
          navyDark: "#182338",
          gold: "#876a20",
          goldLight: "#b4935a",
          goldBright: "#d9bd82",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f7f5f0",
          dark: "#1f2937",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "Verdana", "Helvetica", "Arial", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.2em",
      },
    },
  },
  plugins: [],
};

export default config;
