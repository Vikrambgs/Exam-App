/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontSize: {
        'small': ['0.875rem', { lineHeight: '1.25rem' }],
        'medium': ['1rem', { lineHeight: '1.5rem' }],
        'large': ['1.125rem', { lineHeight: '1.75rem' }],
      },
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
