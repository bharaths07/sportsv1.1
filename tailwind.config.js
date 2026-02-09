/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-page)",
        surface: "var(--bg-card)",
        muted: "var(--bg-muted)",
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-hover)",
          light: "#eff6ff", // Keeping hardcoded light for now as user didn't specify variable
        },
        secondary: "var(--accent)",
        accent: "var(--accent)",
        live: "var(--live)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          inverse: "var(--text-inverse)",
        },
        border: "var(--border)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
