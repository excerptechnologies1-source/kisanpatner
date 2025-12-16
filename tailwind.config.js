/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        body: ["Poppins_100Regular"],     // paragraph
        medium: ["Poppins_500Medium"],   // buttons and inputs
        heading: ["Poppins_700Bold"],     // headings
        subheading: ["Poppins_600SemiBold"],
      },
    },
  },
  plugins: [],
};
