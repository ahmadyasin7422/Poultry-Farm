/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        farm: {
          50: '#f7f9f4',
          100: '#eef3e6',
          200: '#d9e6c8',
          300: '#b8d098',
          400: '#96b66a',
          500: '#789a4a',
          600: '#5c7a38',
          700: '#48602d',
          800: '#3b4d27',
          900: '#334023',
        },
        amber: {
          farm: '#d97706',
        },
      },
    },
  },
  plugins: [],
};
