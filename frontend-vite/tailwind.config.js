/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A66C2', // LinkedIn blue
          50: '#E8F4FB',
          100: '#D1E9F7',
          200: '#A3D3EF',
          300: '#75BDE7',
          400: '#47A7DF',
          500: '#0A66C2',
          600: '#08529B',
          700: '#063E74',
          800: '#042A4D',
          900: '#021626',
        },
        secondary: {
          DEFAULT: '#25D366', // WhatsApp green
          50: '#E8F9EE',
          100: '#D1F3DD',
          200: '#A3E7BB',
          300: '#75DB99',
          400: '#47CF77',
          500: '#25D366',
          600: '#1EA652',
          700: '#16793D',
          800: '#0F4C29',
          900: '#071F14',
        },
        facebook: '#1877F2',
        instagram: '#E4405F',
        linkedin: '#0A66C2',
        whatsapp: '#25D366',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

