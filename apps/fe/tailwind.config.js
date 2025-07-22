const svgToDataUri = require('mini-svg-data-uri');
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '480px',
        'max-2xl': { max: '1536px' },
        'max-xl': { max: '1280px' },
        'max-sd': { max: '1194px' },
        'max-lg': { max: '1024px' },
        'max-md': { max: '768px' },
      },
      fontSize: {
        14: '14px',
      },
      fontFamily: {
        sans: ['var(--font-sans, "")', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono, "")', ...defaultTheme.fontFamily.mono],
        playfair: ['var(--font-playfair)', 'Playfair Display', ...defaultTheme.fontFamily.serif],
      },
      borderRadius: {
        15: '15px',
        30: '30px',
      },
      colors: {
        divider: {
          light: colors.slate[200],
          dark: colors.slate[800],
        },
        brand: {
          orange: '#F15A24',
        },
        grayECO: '#BCBEC0',
        text: {
          primary: '#1A253A',
          secondary: '#4B5563', // Darker gray for better contrast (instead of #7D7D7D)
        },
        card: {
          bg: '#F4F4F4',
        },
      },
      maxWidth: {
        container: '1440px',
      },
      animation: {
        'bounce-x': 'bounce-x 1s infinite',
      },
      keyframes: {
        'bounce-x': {
          '0%, 100%': {
            transform: 'translateX(25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateX(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
    },
  },
  safelist: [
    // ECMP Colors
    {
      pattern:
        /^(bg|text|border|from|to|shadow)-(purple|indigo|blue)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    // Other project colors
    {
      pattern:
        /^(bg|text|border|from|to|shadow)-(sky|cyan|emerald|green|teal|amber|yellow|orange|rose|pink|red)-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
  plugins: [
    function ({ addVariant }) {
      addVariant('fm', '.fm &');
    },
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'bg-grid': (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}" stroke-dasharray="5 3" transform="scale(1, -1)"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme('backgroundColor')), type: 'color' }
      );
    },
    require('@headlessui/tailwindcss'),
    require('tailwindcss-accent')({
      colors: ['violet', 'blue'],
      root: 'violet',
    }),
  ],
};
