/** @type {import('tailwindcss').Config} */
// Build-time only (not served — excluded via .assetsignore).
// Scans HTML + the JS templates in app.js for the utility classes actually
// used, then `npx tailwindcss` emits a static assets/css/tw.css. This replaces
// the Tailwind Play CDN so the CSP can drop 'unsafe-eval' and the external script.
module.exports = {
  content: ["./*.html", "./assets/js/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui"],
        display: ["Geist", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
