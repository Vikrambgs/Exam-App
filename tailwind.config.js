/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily : {
        'roboto': ['Roboto', 'sans-serif']
      },
      gridTemplateColumns : {
        25 : 'repeat(25, minmax(0, 1fr))'
      }
    },
  },
  plugins: [],
}
