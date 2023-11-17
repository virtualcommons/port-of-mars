import vue from "@vitejs/plugin-vue2";
import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import autoprefixer from "autoprefixer";

let SENTRY_DSN = "";
if (fs.existsSync("/run/secrets/sentry_dsn")) {
  SENTRY_DSN = fs.readFileSync("/run/secrets/sentry_dsn", "utf8").trim();
}

export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  resolve: {
    alias: {
      "@port-of-mars/shared": path.resolve("../shared/src"),
      "@port-of-mars/client": path.resolve("./src"),
      "~": path.resolve("./node_modules"),
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer({})],
    },
    preprocessorOptions: {
      scss: {
        includePaths: ["node_modules"],
        additionalData: `@import "src/stylesheets/utilities/_mixins.scss";
                         @import "src/stylesheets/utilities/_variables.scss";
                         @import "src/stylesheets/utilities/color-palette.scss";`,
      },
    },
  },
  define: {
    "process.env.SERVER_URL_WS": JSON.stringify(
      process.env.NODE_ENV === "development" ? "ws://localhost:2567" : ""
    ),
    "process.env.SERVER_URL_HTTP": JSON.stringify(
      process.env.NODE_ENV === "development" ? "http://localhost:2567" : ""
    ),
    "process.env.SENTRY_DSN": JSON.stringify(SENTRY_DSN),
  },
});
