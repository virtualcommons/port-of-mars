import crypto from "crypto";
import { defineNuxtConfig } from "nuxt";
import "reflect-metadata";

const jwtSecretToken = crypto.randomBytes(48).toString('base64');

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
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
    strict: false,
  },
});
