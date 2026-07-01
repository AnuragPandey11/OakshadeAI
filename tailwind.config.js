/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        jet: '#0A0A0A',
        // Driven by an inline `--primary` CSS var (hex) on the flip cards.
        // Relative-color syntax lets Tailwind's /opacity modifiers work.
        primary: 'rgb(from var(--primary) r g b / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
