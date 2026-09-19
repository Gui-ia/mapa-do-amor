import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf9f4',
          100: '#fbf3e8',
          200: '#f6e5ce',
          300: '#edd0ab',
          400: '#e2b380',
          500: '#d79758',
          600: '#c77d41',
          700: '#a66236',
          800: '#854f30',
          900: '#6d422a',
          gold: '#c5a059',
          'gold-light': '#dfc382',
          rose: '#8e4b5d',
          'rose-light': '#b56d81',
          mystic: '#171321',
          'mystic-card': '#201b2e',
          'mystic-border': '#332b47',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
