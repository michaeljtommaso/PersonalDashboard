import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        deep: '#0f1117',
        surface: '#1a1d2e',
        card: '#1e2235',
        health: '#10b981',
        business: '#f59e0b',
        academic: '#3b82f6',
        ai: '#8b5cf6',
        brain: '#06b6d4',
        light: '#f1f5f9',
        dim: '#94a3b8',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '12px',
        lg: '16px',
      },
      fontFamily: {
        sans: [
          'Geist',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
