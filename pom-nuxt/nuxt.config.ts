import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  alias: {
    "@port-of-mars/shared/": "../shared/src/",
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  typescript: {
    strict: true,
  },
});
