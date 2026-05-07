import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/domains/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:        'var(--bg)',
        surface:   'var(--surface)',
        'surface-2':'var(--surface-2)',
        line:      'var(--line)',
        'line-soft':'var(--line-soft)',
        ink: {
          DEFAULT: 'var(--ink)',
          2:       'var(--ink-2)',
          3:       'var(--ink-3)',
          4:       'var(--ink-4)',
        },
        terra: {
          DEFAULT: 'var(--terra)',
          2:       'var(--terra-2)',
          bg:      'var(--terra-bg)',
        },
        emerald: {
          DEFAULT: 'var(--emerald)',
          2:       'var(--emerald-2)',
          bg:      'var(--emerald-bg)',
        },
        gold: {
          DEFAULT: 'var(--gold)',
          bg:      'var(--gold-bg)',
        },
        salvia: {
          DEFAULT: 'var(--salvia)',
          2:       'var(--salvia-2)',
          bg:      'var(--salvia-bg)',
        },
        pos:  'var(--pos)',
        neg:  'var(--neg)',
        warn: 'var(--warn)',
      },
      fontFamily: {
        sans:  ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono:  ['var(--font-mono)'],
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
}

export default config
