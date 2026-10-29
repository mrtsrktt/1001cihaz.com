/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#16242B',
        brandRed: '#C82B35',
        darkHero: '#122129',
        pageBg: '#FFFFFF',
        surfaceSecondary: '#F3F5F5',
        textSecondary: '#637078',
        lineBorder: '#E2E7E8',
        lightRedBg: '#FBF0F0',
        anthracite: {
          900: '#16242B',
          950: '#122129',
        },
        mruRed: {
          500: '#C82B35',
          600: '#C82B35',
          700: '#B3232C',
        }
      },
      fontFamily: {
        sans: ['"Manrope"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        'page': '1280px',
      }
    },
  },
  plugins: [],
}
