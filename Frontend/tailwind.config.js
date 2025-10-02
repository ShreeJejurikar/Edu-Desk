/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
darkMode: ['class', '[data-theme="dark"]'], 
  theme: {
    extend: {
      animation: {
        fadeInScale: "fadeInScale 0.4s ease-out",
      },
      keyframes: {
        fadeInScale: {
          '0%': { opacity: 0, transform: 'scale(0.9)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}