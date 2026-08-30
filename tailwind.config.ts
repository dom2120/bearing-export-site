import type { Config } from 'tailwindcss';

export default {
  content: ['./client/**/*.{ts,tsx}', './shared/**/*.ts'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0a4b8a',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#0a4b8a',
          600: '#083d70',
          700: '#072f55',
          800: '#05223d',
          900: '#031526',
          dark: '#072f55',
        },
        accent: {
          DEFAULT: '#e87d0e',
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#e87d0e',
          600: '#c56a0c',
          700: '#a1570a',
          800: '#7d4408',
          900: '#593106',
        },
        secondary: {
          DEFAULT: '#e87d0e',
          foreground: '#ffffff',
        },
        background: {
          page: '#f8fafc',
          card: '#ffffff',
          dark: '#0f172a',
        },
        foreground: '#1e293b',
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#0a4b8a',
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
