/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101218",
        surface: "#1A1D26",
        surfaceAlt: "#20232E",
        border: "#2B2F3B",
        muted: "#8B8FA0",
        flame1: "#FF5A2E",
        flame2: "#FFB627",
        teal: "#33D6C0",
        danger: "#FF6B6B",
      },
      backgroundImage: {
        ember: "linear-gradient(95deg, #FF5A2E, #FFB627)",
      },
    },
  },
  plugins: [],
};
