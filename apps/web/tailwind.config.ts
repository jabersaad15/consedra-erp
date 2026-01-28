import type { Config } from 'tailwindcss';
const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50:'#eff6ff', 100:'#dbeafe', 500:'#3b82f6', 600:'#2563eb', 700:'#1d4ed8', 900:'#1e3a5f' },
        sidebar: { DEFAULT:'#0f172a', foreground:'#e2e8f0', accent:'#1e293b' },
        border: 'hsl(214 32% 91%)', input: 'hsl(214 32% 91%)', ring: 'hsl(221 83% 53%)',
        background: 'hsl(0 0% 100%)', foreground: 'hsl(222 47% 11%)',
        card: { DEFAULT: 'hsl(0 0% 100%)', foreground: 'hsl(222 47% 11%)' },
        muted: { DEFAULT: 'hsl(210 40% 96%)', foreground: 'hsl(215 16% 47%)' },
        destructive: { DEFAULT: 'hsl(0 84% 60%)', foreground: 'hsl(210 40% 98%)' },
      },
      fontFamily: { sans: ['Inter','Noto Sans Arabic','sans-serif'] },
    },
  },
  plugins: [],
};
export default config;