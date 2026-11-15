/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          blue: '#1D4ED8',      // Royal Blue primary
          blueHover: '#1E40AF',
          slate: '#0F172A',     // Dark slate ink
          gray: '#64748B',      // Secondary text
          lightBg: '#F8FAFC',   // Warm soft off-white background
          card: '#FFFFFF',      // Pure white card
          border: '#E2E8F0',    // Crisp 1px solid border
          emerald: '#059669',   // Emerald green verified
          emeraldLight: '#ECFDF5',
          amber: '#D97706',     // Amber delay alerts
          amberLight: '#FFFBEB',
          red: '#DC2626',       // Dispute red
          redLight: '#FEF2F2',
        }
      }
    },
  },
  plugins: [],
}
