import vue from "@vitejs/plugin-vue2";
import { defineConfig } from "vite";
import path from "path";
import autoprefixer from "autoprefixer";

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
    // make process.env work on the client
    ...Object.keys(process.env).reduce((acc, key) => {
      acc[`process.env.${key}`] = JSON.stringify(process.env[key]);
      return acc;
    }, {}),
  },
});
