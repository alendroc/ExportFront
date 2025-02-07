/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  "darkMode":"class",
  theme: {
    extend: {
      fontSize: {
        'xxs': '6px', // Agregamos una clase personalizada para 6px
        'xxxs': '4px', // Otra clase para 4px si lo necesitas
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        poppi: ['Poppins', 'sans-serif']
      },
      colors:{
        
      },
      gridTemplateColumns: {
        '90px-auto': '90px auto',
        '300px-auto': '300px auto',
      },
      screens: {
        '100%':'1600px'
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        scaleLoop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" }
        }
      },
      animation: {
        'bounce-text': 'bounce 0.3s ease-in-out',
         "scale-loop": "scaleLoop 0.6s ease-in-out"
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar")
  ],
}

