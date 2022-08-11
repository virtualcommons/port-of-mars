/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./composables/**/*.{js,ts}",
    "./plugins/**/*.{js,ts}",
    "./app.{js,ts,vue}",
    // * https://github.com/nuxt-community/tailwindcss-module/issues/429#issuecomment-1041486660
    // *  the main reason we need to include nuxt.config.{js,ts} in the list of files that Tailwind CSS scans is because you might be applying Tailwind classes to the <html> or <body> elements in this file using the htmlAttrs or bodyAttrs properties available in Vue Meta. By excluding this file, those styles won't be picked up, and your site will look incorrect.
    // "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'home-about': "url('public/bg-moon.png')",
        'home-stats': "url('public/bg-stars.png')",
        'home-winners': "url('public/bg-jupiter.png')",
        'home-gameplay': "url('public/bg-dark-moon.png')",
        'login': "url('public/bg-dark-moon.png')",
      },
      colors: {
        'main': '#9C5147',
        'light-accent': '#CAA66E',
        'dark-accent': '#A49CA6',
        'dark-shade': '#221A1B',
        'light-shade': '#F1E0C5'
      }
    }
    
  },
  plugins: [
    // plugin(function({addBase, theme})) {
    //   addBase({
    //     'h1': { }
    //   })
    // }
  ],
}
