import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  alias: {
    "@": "./*",
    assets: "./assets",
  },
  build: {
    postcss: {
      plugins: {
        tailwindcss: {
          cssPath: "assets/css/main.css",
          configPath: "tailwind.config.js",
          exposeConfig: false,
          config: {},
          injectPosition: 0,
          viewer: true,
        },
        autoprefixer: {},
      },
    },
  },
  css: ["@/assets/css/main.css"],
  modules: ["@nuxtjs/tailwindcss"],
});
