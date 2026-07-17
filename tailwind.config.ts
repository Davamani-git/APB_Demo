import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"]:
  ,
  theme: {
    extend: {
      colors: {
        primary: "#1E88E5",
        secondary: "#FFB300",
        background: {
          DEFAULT: "#0F172A",
          card: "#111827"
        },
        text: {
          primary: "#F9FAFB",
          secondary: "#9CA3AF"
        },
        border: {
          subtle: "#1F2937"
        },
        error: "#EF5350",
        success: "#4CAF50",
        warning: "#FFB300"
      },
      borderRadius: {
        card: "12px",
        button: "8px"
      },
      boxShadow: {
        card: "0 10px 25px rgba(15, 23, 42, 0.45)",
        banner: "0 8px 20px rgba(0,0,0,0.35)"
      },
      spacing: {
        0: "0px",
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px"
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px"
      }
    }
  },
  plugins: []
};

export default config;
