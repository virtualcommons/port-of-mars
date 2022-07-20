import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  alias: {
    "@": "./*",
    assets: "./assets/",
    composables: "./composables/",
    "@port-of-mars/shared/": "../shared/src/",
  },
  tailwindcss: {
    cssPath: "assets/css/main.css",
    configPath: "tailwind.config.js",
    exposeConfig: false,
    config: {},
    injectPosition: 0,
    viewer: true,
  },
  // build: {
  //   postcss: {
  //     plugins: {

  //       autoprefixer: {},
  //     },
  //   },
  // },
  css: ["@/assets/css/main.css"],
  modules: ["@nuxtjs/tailwindcss"],
  // ssr: false,
  typescript: {
    strict: true,
  },
});
