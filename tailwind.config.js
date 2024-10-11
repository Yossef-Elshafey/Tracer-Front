/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      animation: {
        'pulse-once': 'pulse 1s linear 1',
      },
      colors: {
        main: '#0d1017',
        secondary: '#1d89e4',
      },
    },
  },
  plugins: [],
};
