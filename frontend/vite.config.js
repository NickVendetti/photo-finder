import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const mode = process.env.NODE_ENV || "development";
const envFile = `.env.${mode}`;

import dotenv from "dotenv";
dotenv.config({ path: envFile });

// Default `/api` keeps the browser on the Vite origin and avoids CORS during local dev.
// Override with VITE_API_BASE_URL (e.g. http://localhost:5002) if you want to hit the API directly.
// If requests fail, check DevTools → Network: request URL, response CORS headers, and OPTIONS preflight.
const apiBaseUrl = process.env.VITE_API_BASE_URL ?? "/api";

const devProxyTarget =
  process.env.VITE_DEV_PROXY_TARGET || "http://localhost:5002";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  server: {
    proxy: {
      "/api": {
        target: devProxyTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: false,
  },
  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(apiBaseUrl),
  },
});
