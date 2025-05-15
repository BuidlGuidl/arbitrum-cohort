/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        default: {
          primary: "#E5E5E5",
          "primary-content": "#000000",
          secondary: "#12AAFF",
          "secondary-content": "#212638",
          accent: "#68FF43",
          "accent-content": "#000000",
          neutral: "#212638",
          "neutral-content": "#ffffff",
          "base-100": "#2A3D58",
          "base-200": "#25354C",
          "base-300": "#16263B",
          "base-content": "#ffffff",
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          "--rounded-btn": "9999rem",
          ".tooltip": { "--tooltip-tail": "6px" },
          ".link": { textUnderlineOffset: "2px" },
          ".link:hover": { opacity: "80%" },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: { center: "0 0 12px -2px rgb(0 0 0 / 0.05)" },
      animation: { "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite" },
    },
  },
};
