export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#4F6F45", 
        "primary-dark": "#3A5233", 
        "secondary": "#2A2A2A", 
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "serif": ["Playfair Display", "serif"],
        "signature": ["Great Vibes", "cursive"],
      },
    },
  },
  plugins: [],
}
