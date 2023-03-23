/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        // 'oswald': ['var(--font-oswald)'],
        'montserrat': ['var(--font-montserrat)'],
        // 'rubik': ['var(--font-rubik)'],
        'roboto': ['var(--font-roboto)']
      },
      colors: {
        'charleston-green': '#272A34',
        'cultured': '#F6F6F6',
        'united-nations-blue': '#588DDA',

        'gray-1': '#0e0e10',
        'gray-2': '#18181b',
        'gray-3': '#1f1f23',
        'gray-4': '#26262c',
        'gray-5': '#323239',
        'gray-6': '#3b3b44',
        'gray-7': '#53535f',
        'gray-8': '#848494',
        'gray-9': '#adadb8',
        'gray-10': '#c8c8d0',
        'gray-11': '#d3d3d9',
        'gray-12': '#dedee3',
        'gray-13': '#e6e6ea',
        'gray-14': '#efeff1',
        'gray-15': '#f7f7f8',

        'nexus-1': '#040109',
        'nexus-2': '#0d031c',
        'nexus-3': '#15052e',
        'nexus-4': '#24094e',
        'nexus-5': '#330c6e',
        'nexus-6': '#451093',
        'nexus-7': '#5c16c5',
        'nexus-8': '#772ce8',
        'nexus-9': '#9146FF',
        'nexus-10': '#a970ff',
        'nexus-11': '#bf94ff',
        'nexus-12': '#d1b3ff',
        'nexus-13': '#e3d1ff',
        'nexus-14': '#ede0ff',
        'nexus-15': '#f3ebff',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('flowbite/plugin'),
  ],
}
