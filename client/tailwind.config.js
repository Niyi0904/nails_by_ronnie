/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Brand color tokens ─────────────────────────────────────
      // Use these everywhere instead of hardcoded hex values.
      //
      //   bg-brand-rose          → #943F54 (primary CTA, headings)
      //   bg-brand-blush         → #D77A8B (hover states, borders, labels)
      //   bg-brand-rosegold      → #B76E79 (premium accents, dividers)
      //   bg-brand-cream         → #FFF5F8 (light page backgrounds)
      //   hover:bg-brand-rose-dark → #7a3345 (button hover)
      //
      colors: {
        brand: {
          rose:      '#943F54',
          'rose-dark': '#7a3345',
          blush:     '#D77A8B',
          rosegold:  '#B76E79',
          cream:     '#FFF5F8',
          'cream-deep': '#F9D8DA',
        },
      },

      // ── Typography ─────────────────────────────────────────────
      fontFamily: {
        // Dancing Script — used for elegant brand headings
        // CSS var is set in layout.tsx as --font-heading
        heading: ['var(--font-heading)', 'Dancing Script', 'cursive'],
        // Poppins — body & UI text (already loaded in layout.tsx)
        sans: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },

      // ── Border radius ──────────────────────────────────────────
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // ── Box shadows ────────────────────────────────────────────
      boxShadow: {
        'rose-sm': '0 4px 14px 0 rgba(148, 63, 84, 0.15)',
        'rose-md': '0 8px 30px 0 rgba(148, 63, 84, 0.20)',
        'rose-lg': '0 20px 60px 0 rgba(148, 63, 84, 0.25)',
      },

      // ── Animations ─────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        shimmer: 'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [],
};