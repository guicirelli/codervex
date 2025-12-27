import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4xl': '2560px',
      },
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9ff',
          200: '#ddd6ff',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#928df6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9ff',
          200: '#ddd6ff',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#928df6',
        },
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 50s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
  // Otimizações de performance
  corePlugins: {
    preflight: true,
  },
  // Purge CSS otimizado
  future: {
    hoverOnlyWhenSupported: true,
  },
}

export default config
