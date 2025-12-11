/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#244B35",
        secondary: "#E09B6B",
        third: "#EFEAE1",
        border: "#D9D9D9",
        background: "#FFFFFF",
        foreground: "#000000",
      },
      fontFamily: {
        inter: ['"Be Vietnam Pro"', "sans-serif"],
      },
    },
  },
};
