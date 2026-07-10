/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        boutique: {
          bg: '#F8F7F4',
          surface: '#FFFFFF',
          surfaceSoft: '#F4F2EE',
          mute: '#6B7280',
          accent: '#0F4B5F',
          accentSoft: '#DDE8ED',
          border: '#D8D6D3',
        },
      },
      boxShadow: {
        boutique: '0 24px 60px rgba(15, 23, 42, 0.08)',
        boutiqueSoft: '0 12px 30px rgba(15, 23, 42, 0.06)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-heading)', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      },
    },
  },
  plugins: [],
}
