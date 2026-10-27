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
        // Modern Clean SaaS Foundation (Matching Reference Design)
        background: "#F8FAFC",
        surface: "#FFFFFF",
        "surface-subtle": "#F1F5F9",
        "surface-muted": "#F8FAFC",
        
        // Borders
        border: "#E2E8F0",
        "border-subtle": "#EDF2F7",
        
        // Text
        "text-primary": "#0F172A",
        "text-secondary": "#475569",
        "text-muted": "#64748B",
        "text-subtle": "#94A3B8",

        // Primary Brand Accent (Clean Indigo/Blue)
        primary: {
          DEFAULT: "#2563EB",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
        },

        // Status & Category Card Tints
        accent: {
          red: "#EF4444",
          "red-light": "#FEF2F2",
          "red-border": "#FEE2E2",
          
          blue: "#3B82F6",
          "blue-light": "#EFF6FF",
          "blue-border": "#DBEAFE",

          green: "#10B981",
          "green-light": "#ECFDF5",
          "green-border": "#D1FAE5",

          purple: "#8B5CF6",
          "purple-light": "#F5F3FF",
          "purple-border": "#EDE9FE",

          amber: "#F59E0B",
          "amber-light": "#FFFBEB",
          "amber-border": "#FEF3C7",
        },
      },
      fontFamily: {
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        headline: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        composer: '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      }
    },
  },
  plugins: [],
}
