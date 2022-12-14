/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        whatsApp:"#001821",
        whatsAppBg:"#25D366",
        signUp:"#25754c",
      },
      
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
