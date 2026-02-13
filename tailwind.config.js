/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brandPrimary: "#414BEA",   // Bluestock primary
        brandSecondary: "#7752FE", // Bluestock secondary
        brandAccent: "#F8EDFF",    // Bluestock accent
      },
    },
  },
  plugins: [],
}