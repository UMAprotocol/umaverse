module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Halyard Display", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        primary: "#ff4a4a",
        secondary: "#ffe41e",
        white: "#fff",
        black: "#000",
        gray: {
          100: "hsl(0 0% 96%)",
          200: "hsl(0 0% 85%)",
          300: "hsl(0 0% 70%)",
          400: "hsl(0 0% 51%)",
          500: "hsl(0 0% 30%)",
          600: "hsl(0 0% 20%)",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
