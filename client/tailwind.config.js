/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      mainColor: '#0F293D',
      primary: '#1677FF',
      white: '#ffffff',
    },
    extend: {},
  },
  plugins: [],
};
