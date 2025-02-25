import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// Load the correct `.env` file based on the environment
const mode = process.env.NODE_ENV || "development";
const envFile = `.env.${mode}`;

import dotenv from "dotenv";
dotenv.config({ path: envFile });
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: true,
  },

  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
      process.env.VITE_API_BASE_URL
    ),
  },
});
