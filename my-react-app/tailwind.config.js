/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // <= enables manual dark mode toggling
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

