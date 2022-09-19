/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./composables/**/*.{js,ts}",
    "./plugins/**/*.{js,ts}",
    "./app.{js,ts,vue}"
  ],
  plugins: [require("daisyui")],
  theme: {
    extend: {
      backgroundImage: {
        "home-about": "url('assets/images/bg-moon.png')",
        "home-game-trailer": "url('assets/images/bg-dark-moon.png')",
        "home-winners": "url('assets/images/bg-jupiter.png')",
        "home-gameplay": "url('assets/images/bg-dark-moon.png')",
        "home-news": "url('assets/images/bg-stars.png')",
        login: "url('assets/images/bg-dark-moon.png')"
      },
      colors: {
        main: "#9C5147",
        "light-accent": "#CAA66E",
        "dark-accent": "#A49CA6",
        "dark-shade": "#221A1B",
        "light-shade": "#F1E0C5"
      }
    }
  }
};
