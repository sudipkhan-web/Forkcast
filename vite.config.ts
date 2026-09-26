import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    // GEMINI_API_KEY is intentionally NOT exposed to the browser bundle.
    // The server uses it directly; the voice assistant gets short-lived tokens from /api/live/token.
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
        'formdata-polyfill': path.resolve(import.meta.dirname, 'src/dummy.js'),
        'formdata-polyfill/esm.min.js': path.resolve(import.meta.dirname, 'src/dummy.js'),
        'node-fetch': path.resolve(import.meta.dirname, 'src/dummy.js'),
        'undici': path.resolve(import.meta.dirname, 'src/dummy.js')
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
