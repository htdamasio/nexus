/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'oswald': ['var(--font-oswald)'],
        'montserrat': ['var(--font-montserrat)'],
        'rubik': ['var(--font-rubik)'],
        'roboto': ['var(--font-roboto)']
      },
      colors: {
        'charleston-green': '#272A34',
        'cultured': '#F6F6F6',
        'united-nations-blue': '#588DDA'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
