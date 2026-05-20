import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        cyber: {
          50: '#edfcf4',
          100: '#d3f8e5',
          200: '#aaf0ce',
          300: '#72e3b0',
          400: '#38ce8c',
          500: '#15b371',
          600: '#0a905a',
          700: '#09734a',
          800: '#0b5b3c',
          900: '#0a4b32',
          950: '#042a1d',
        }
      }
    },
  },
  plugins: [],
}
export default config
