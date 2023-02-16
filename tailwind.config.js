/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-light': '#D7E5E4',
        primary: '#9CBDBB',
        'primary-medium': '#81A2A3',
        'primary-dark': '#4D7075',
        'action-1': '#71B2B5',
        'action-2': '#0396A6',
        
      },
      boxShadow: {
        'circle': '0 0 0 500px #9CBDBB',
      },
      grayscale: {
        10: '10%',
        20: '20%',
        30: '30%',
        40: '40%',
        50: '50%',
        60: '60%',
        70: '70%',
        80: '80%',
        90: '90%',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif']
      },
      backgroundImage: {
        'seabed': "url('/img/seabed.png')",
        'fish': "url('/img/fish.png')",
        'fish-opacity': "url('/img/fish_opacity.png')"
      }
    },
  },
  plugins: [],
}