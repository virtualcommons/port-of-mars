import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  alias: {
    "@port-of-mars/shared/": "../shared/src/",
  },

  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  modules: ["@nuxtjs/tailwindcss"],
  typescript: {
    strict: true,
  },
});
