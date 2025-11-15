/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#66b132',
          foreground: '#ffffff',
        },
        background: '#ffffff',
        foreground: '#0a0a0a',
        muted: {
          DEFAULT: '#f4f4f5',
          foreground: '#71717a',
        },
        border: '#e4e4e7',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0a0a0a',
        },
      },
    },
  },
  plugins: [],
};

