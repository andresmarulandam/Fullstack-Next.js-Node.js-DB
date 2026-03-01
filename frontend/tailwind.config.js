/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2c3e50',
        'primary-dark': '#1e2a36',
        secondary: '#34495e',
        'secondary-dark': '#2a3a47',
        danger: '#c0392b',
        'danger-dark': '#a93226',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
