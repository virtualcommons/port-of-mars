import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  // https://tailwindcss.nuxtjs.org/getting-started/setup/
  modules: ["@nuxtjs/tailwindcss"],
  // ssr: false,

  // FIXME: re-enable when we're ready to have full typescript type checking
  // typescript: {
  //   shim: false,
  //   strict: true,
  // },
});
