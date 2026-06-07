import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fff8f3",
        blush: "#f7b7c8",
        coral: "#ef8f82",
        rosewood: "#7d4a55",
        ink: "#2d2528",
        mist: "#f0ece8"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(125, 74, 85, 0.14)",
        lift: "0 12px 30px rgba(239, 143, 130, 0.18)"
      },
      borderRadius: {
        android: "28px"
      }
    }
  },
  plugins: []
};

export default config;
