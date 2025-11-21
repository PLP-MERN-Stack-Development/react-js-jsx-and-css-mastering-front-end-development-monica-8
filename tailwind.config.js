/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // This line tells Tailwind to scan all React and TypeScript files in src
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  // This enables the dark mode class on the <html> element
  darkMode: 'class', 
  theme: {
    extend: {},
  },
  plugins: [],
}