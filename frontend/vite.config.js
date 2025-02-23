import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Load the correct `.env` file based on the environment
// const mode = process.env.NODE_ENV || 'development';
// const envFile = `.env.${mode}`;

// import dotenv from 'dotenv';
// dotenv.config({ path: envFile });
// console.log(mode,)
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Ensures source maps are generated
  },
  // server: {
  //   host: true,
  //   proxy: {
  //     '/api': {
  //       target: 'http://my-backend:6000',
  //       changeOrigin: true,
  //       secure: false
  //     }
  //   }
  // },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL)
  }
})
