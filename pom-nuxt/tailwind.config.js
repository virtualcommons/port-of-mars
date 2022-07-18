/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    // * https://github.com/nuxt-community/tailwindcss-module/issues/429#issuecomment-1041486660
    // *  the main reason we need to include nuxt.config.{js,ts} in the list of files that Tailwind CSS scans is because you might be applying Tailwind classes to the <html> or <body> elements in this file using the htmlAttrs or bodyAttrs properties available in Vue Meta. By excluding this file, those styles won't be picked up, and your site will look incorrect.
    // "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
