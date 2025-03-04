import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const mode = process.env.NODE_ENV || "development";
const envFile = `.env.${mode}`;

import dotenv from "dotenv";
dotenv.config({ path: envFile });

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: false,
  },
  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
      process.env.VITE_API_BASE_URL
    ),
  },
});
