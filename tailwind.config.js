/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 requer o preset próprio para gerar CSS compatível com React Native
  presets: [require('nativewind/preset')],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    // Tokens de design serão adicionados na Fase 1
    // Por enquanto mantemos o tema default do Tailwind
    extend: {},
  },
  plugins: [],
}
