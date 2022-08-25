import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: true,
    watch: {
      usePolling: true,
    },
  },
});
