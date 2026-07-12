/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5F5F5',
          100: '#EEEEEE',
          200: '#E0E0E0',
          300: '#C0C0C0',
          400: '#9E9E9E',
          500: '#76ABAE',
          600: '#5D8E91',
          700: '#4A6E71',
          800: '#31363F',
          900: '#222831',
          950: '#1A1E24',
        },
        surface: {
          50: '#F5F5F5',
          100: '#EEEEEE',
          200: '#E0E0E0',
          300: '#C0C0C0',
          400: '#9E9E9E',
          500: '#76ABAE',
          600: '#5D8E91',
          700: '#4A6E71',
          800: '#31363F',
          900: '#222831',
          950: '#1A1E24',
        },
        accent: {
          50: '#F5F5F5',
          100: '#EEEEEE',
          200: '#E0E0E0',
          300: '#C0C0C0',
          400: '#9E9E9E',
          500: '#76ABAE',
          600: '#5D8E91',
          700: '#4A6E71',
          800: '#31363F',
          900: '#222831',
        },
        warmgray: {
          50: '#F5F5F5',
          100: '#EEEEEE',
          200: '#E0E0E0',
          300: '#C0C0C0',
          400: '#9E9E9E',
          500: '#76ABAE',
          600: '#5D8E91',
          700: '#4A6E71',
          800: '#31363F',
          900: '#222831',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
