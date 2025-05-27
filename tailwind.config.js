/** @type {import('tailwindcss').Config} */
module.exports = {
 
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {animation: {
        gradient: 'gradientBG 10s ease infinite',
      },
      backgroundSize: {
        '200%': '200% 200%',
      },},
  },
  plugins: [],
}

