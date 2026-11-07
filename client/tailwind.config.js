/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        leaf: {
          DEFAULT: '#38a169',
          light: '#68d391',
          dark: '#276749'
        },
        agri: {
          bg: '#fbfcf8',
          yellow: '#f6ad55',
          charcoal: '#1a202c',
          soil: '#8c6239',
          amber: '#d97706',
          mutedRed: '#e53e3e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
