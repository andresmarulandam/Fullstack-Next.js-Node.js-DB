/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        'primary-dark': '#0284c7',
        secondary: '#06b6d4',
        'secondary-dark': '#0891b2',
        danger: '#ef4444',
        'danger-dark': '#dc2626',
        'dark-bg': '#0f172a',
        'dark-bg-secondary': '#1e293b',
        'dark-border': '#334155',
        'dark-text': '#f1f5f9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
