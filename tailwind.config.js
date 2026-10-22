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
      // Seamless loop for the tech marquee: the track holds its list twice,
      // so sliding by half its width lands on an identical frame.
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 45s linear infinite',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
