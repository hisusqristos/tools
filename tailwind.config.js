/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          200: '#DCD1FA',
          300: '#CABAF7',
          500: '#916FF2',
          600: '#7F56D9',
          700: '#6941C6',
        },
        beige : {
          200 :'#f2f2f2',
          300: '#ededed'
        },
        grey : {
          500 : "#666666"
        }
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