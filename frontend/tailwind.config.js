/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#fcf8f9',       // very light pink/white background
          card: '#ffffff',     // white cards
          primary: '#f9a8d4',  // soft pink (tailwind pink-300)
          accent: '#ec4899',   // slightly darker pink (tailwind pink-500)
          navy: '#0f172a',     // deep navy text
          danger: '#ef4444',   // red for emergency
          warning: '#f59e0b',  // orange for high
          success: '#10b981',  // green for resolved
          soft: '#fdf2f8'      // soft pink tint for active states
        }
      }
    },
  },
  plugins: [],
}
