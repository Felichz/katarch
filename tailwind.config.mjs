/** @type {import('tailwindcss').Config} */
// The memo world styles itself with tokens in Layout.astro; no utility
// palettes are defined. This config only keeps the integration happy.
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
};
