import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FBF9F5', parchment: '#F3EFE6', ink: '#161412', umber: '#6E6A63',
        linen: '#E6E0D4', brass: '#9C6D3B', tag: '#EFE9DC', 'tag-ink': '#5A4D3B',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'Arial', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
