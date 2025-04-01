/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          500: '#7F56D9',
          600: '#7F56D9',
          700: '#6941C6',
        },
        beige : {
          200 :'#f2f2f2',
        300: '#ededed'}
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      fontSize : {
        small : '16px'
      },
      maxHeight : {
        img : 600
      },
      maxWidth : {
        img : 600
      },
      minHeight : {
        img : 300
      },
      minWidth : {
        img : 300
      }
    },
  },
  plugins: [],
}