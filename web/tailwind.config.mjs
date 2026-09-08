/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          950: 'rgb(var(--color-slate-950) / <alpha-value>)',
          900: 'rgb(var(--color-slate-900) / <alpha-value>)',
          850: 'rgb(var(--color-slate-850) / <alpha-value>)',
          800: 'rgb(var(--color-slate-800) / <alpha-value>)',
          750: 'rgb(var(--color-slate-750) / <alpha-value>)',
          700: 'rgb(var(--color-slate-700) / <alpha-value>)',
        },
        emerald: {
          950: 'rgb(var(--color-emerald-950) / <alpha-value>)',
        },
        amber: {
          950: 'rgb(var(--color-amber-950) / <alpha-value>)',
        },
        rose: {
          950: 'rgb(var(--color-rose-950) / <alpha-value>)',
        },
        sky: {
          950: 'rgb(var(--color-sky-950) / <alpha-value>)',
        },
        dimmed: {
          bg: '#f6f8fa',       // Soft dimmed light background
          card: '#ffffff',     // Card surface
          border: '#e2e8f0',   // Subtle border
          muted: '#64748b',    // Muted text
          dark: '#0f172a',     // Primary heading text
          body: '#334155',     // Body reading text
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        podium: {
          gold: '#b45309',
          silver: '#475569',
          bronze: '#9a3412',
        }
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: '#334155',
            h1: { color: '#0f172a', fontWeight: '800' },
            h2: { color: '#0f172a', fontWeight: '700' },
            h3: { color: '#1e293b', fontWeight: '700' },
            h4: { color: '#1e293b', fontWeight: '600' },
            strong: { color: '#0f172a', fontWeight: '600' },
            code: {
              color: '#047857',
              backgroundColor: '#f1f5f9',
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
              border: '1px solid #e2e8f0',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            a: {
              color: '#059669',
              textDecoration: 'underline',
              fontWeight: '500',
              '&:hover': { color: '#047857' },
            },
            blockquote: {
              borderLeftColor: '#10b981',
              color: '#475569',
              fontStyle: 'italic',
            },
          },
        },
        dark: {
          css: {
            color: '#cbd5e1',
            h1: { color: '#f8fafc' },
            h2: { color: '#f8fafc' },
            h3: { color: '#f1f5f9' },
            h4: { color: '#f1f5f9' },
            strong: { color: '#f8fafc' },
            code: {
              color: '#34d399',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
            },
            a: {
              color: '#34d399',
              '&:hover': { color: '#6ee7b7' },
            },
            blockquote: {
              borderLeftColor: '#10b981',
              color: '#94a3b8',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
