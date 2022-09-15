import { defineNuxtConfig } from "nuxt";
import crypto from "crypto";

const jwtSecretToken = crypto.randomBytes(48).toString('base64');

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  alias: {
    "~": "/<rootDir>",
    "@": "/<rootDir>",
    "assets": "/<rootDir>/assets",
    "public": "/<rootDir>/public",
    "@port-of-mars/shared/": "../shared/src/",
    "@port-of-mars/db/": "./databases/*"
  },

  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  runtimeConfig: {
    jwtSecretToken,
  },
  typescript: {
    strict: true,
  },
});
