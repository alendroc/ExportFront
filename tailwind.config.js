/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  "darkMode":"class",
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      colors:{
        
      },
      gridTemplateColumns: {
        '90px-auto': '90px auto',
        '300px-auto': '300px auto',
      },
    },
  },
  plugins: [],
}

