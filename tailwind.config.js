/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#D40032',
        primaryAccent: '#FF2442',
        primaryDark: '#8C001A',
        bg: '#000000',
        bgSecondary: '#0D0D0D',
        card: '#111111',
        text: '#F2F2F2',
        textSecondary: '#9E9E9E',
        textMuted: '#6B6B6B',
        success: '#2ECC71',
        warning: '#F4A100',
        danger: '#FF0033',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}

