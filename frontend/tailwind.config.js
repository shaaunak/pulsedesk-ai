/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Brand Foundation (User Specification)
        "brand-feather": "#0B2224", // Black Feather: base abyss
        "brand-storm": "#336269",   // After the Storm: mid teal structure
        "brand-bloom": "#93D4D8",   // Aqua Bloom: radiant focal accent
        "brand-socialist": "#941D1D", // Socialist: dark red reserved for critical blockers

        // Semantic Backgrounds & Atmospheric Teal Surfaces
        "background": "#0B2224",
        "surface": "#0B2224",
        "surface-container-lowest": "#061517", // deep abyss surface
        "surface-container-low": "#081a1c",
        "surface-container": "#0f2c30",
        "surface-container-high": "#15383d",
        "surface-container-highest": "#1c454b",
        "surface-bright": "#245259",
        "surface-dim": "#061517",

        // Primary Accent: Radiant Aqua Bloom
        "primary": "#93D4D8",
        "primary-container": "#336269",
        "on-primary": "#0B2224",
        "on-primary-container": "#E6F8F9",
        "primary-fixed": "#B8E9EC",
        "primary-fixed-dim": "#93D4D8",
        "on-primary-fixed": "#042022",
        "on-primary-fixed-variant": "#14464c",
        "inverse-primary": "#245259",

        // Secondary: After the Storm / Mid Teal
        "secondary": "#71A6AD",
        "secondary-container": "#1d4045",
        "on-secondary": "#081a1c",
        "on-secondary-container": "#d6f2f4",
        "secondary-fixed": "#bce6ea",
        "secondary-fixed-dim": "#71a6ad",
        "on-secondary-fixed": "#092225",
        "on-secondary-fixed-variant": "#224b50",

        // Tertiary: Fresh Sage / Subtle Cyan Balance
        "tertiary": "#A3E0C8",
        "tertiary-container": "#184539",
        "on-tertiary": "#07261d",
        "on-tertiary-container": "#c9f3e4",
        "tertiary-fixed": "#b4edda",
        "tertiary-fixed-dim": "#a3e0c8",
        "on-tertiary-fixed": "#05221a",
        "on-tertiary-fixed-variant": "#1c5042",

        // Critical Blocker & Error: Socialist (#941D1D)
        "error": "#FF8A8A",
        "error-container": "#941D1D",
        "on-error": "#FFFFFF",
        "on-error-container": "#FFDAD6",

        // Typography & Lines
        "on-surface": "#F0FDFE",
        "on-surface-variant": "#9FBEC2",
        "inverse-surface": "#F0FDFE",
        "inverse-on-surface": "#0B2224",
        "outline": "#336269",
        "outline-variant": "rgba(147, 212, 216, 0.16)",
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      width: {
        '18': '4.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
  plugins: [],
}
