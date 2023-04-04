/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      flexBasis: {
        '1/11': '11.11111111111111%',
      },
    },
  },
  plugins: [],
};
