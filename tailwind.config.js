/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // Cores via tripleto RGB + <alpha-value> (ver nota em global.css).
      // Os tokens de fundo usam chave LIMPA (canvas/elevated/overlay/highlight)
      // -> classes naturais bg-canvas / bg-elevated. As variáveis CSS mantêm
      // o prefixo --color-bg-* por compatibilidade.
      colors: {
        canvas: 'rgb(var(--color-bg-canvas) / <alpha-value>)',
        elevated: 'rgb(var(--color-bg-elevated) / <alpha-value>)',
        overlay: 'rgb(var(--color-bg-overlay) / <alpha-value>)',
        highlight: 'rgb(var(--color-bg-highlight) / <alpha-value>)',
        'fg-primary': 'rgb(var(--color-fg-primary) / <alpha-value>)',
        'fg-secondary': 'rgb(var(--color-fg-secondary) / <alpha-value>)',
        'fg-muted': 'rgb(var(--color-fg-muted) / <alpha-value>)',
        'fg-inverse': 'rgb(var(--color-fg-inverse) / <alpha-value>)',
        'accent-bronze': 'rgb(var(--color-accent-bronze) / <alpha-value>)',
        'accent-marble': 'rgb(var(--color-accent-marble) / <alpha-value>)',
        'accent-gold': 'rgb(var(--color-accent-gold) / <alpha-value>)',
        'feedback-success': 'rgb(var(--color-feedback-success) / <alpha-value>)',
        'feedback-warning': 'rgb(var(--color-feedback-warning) / <alpha-value>)',
        'feedback-error': 'rgb(var(--color-feedback-error) / <alpha-value>)',
        'border-subtle': 'rgb(var(--color-border-subtle) / <alpha-value>)',
        'border-strong': 'rgb(var(--color-border-strong) / <alpha-value>)',
        divider: 'rgb(var(--color-divider) / <alpha-value>)',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '24px',
        6: '32px',
        7: '48px',
        8: '64px',
      },
      borderRadius: {
        xs: '4px',
        sm: '10px',
        md: '18px',
        lg: '28px',
        xl: '36px',
        full: '9999px',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
