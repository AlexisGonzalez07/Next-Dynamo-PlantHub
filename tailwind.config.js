/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  mode: "jit",
  purge: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "pulse-slow": "pulse-slow 2s infinite",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
      },
    },
  },
  daisyui: {
    themes: [
      {
        // Light theme configuration
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          primary: "#ebdbae",
          secondary: "#647f4d",
          accent: "#4d7c0f",
          neutral: "#fef9c3",
          "base-100": "#365314",
          info: "#7dd3fc",
          success: "#e9d5ff",
          warning: "#fde047",
          error: "#f87171",
        },
        extend: {
          // Extend the hover effects for light theme
          hover: {
            primary: "primary-dark",
            secondary: "secondary-dark",
            accent: "accent-dark",
            neutral: "neutral-dark",
            "base-100": "base-100-dark",
            info: "info-dark",
            success: "success-dark",
            warning: "warning-dark",
            error: "error-dark",
          },
        },
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          primary: "#365314",
          secondary: "#ebdbae",
          accent: "#4d7c0f",
          neutral: "#fef9c3",
          "base-100": "#365314",
          info: "#7dd3fc",
          success: "#e9d5ff",
          warning: "#fde047",
          error: "#b91c1c"
        },
        extend: {
          // Extend the hover effects for light theme
          hover: {
            primary: "primary-light",
            secondary: "secondary-light",
            accent: "accent-light",
            neutral: "neutral-light",
            "base-100": "base-100-light",
            info: "info-light",
            success: "success-light",
            warning: "warning-light",
            error: "error-light",
          }
        }
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
