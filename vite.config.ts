import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';
import {BRAND} from './src/brand';

/**
 * Fills __BRAND_NAME__ / __BRAND_DESCRIPTION__ placeholders in files that can't
 * import src/brand.ts (index.html, the PWA manifest and the push service worker),
 * both in the dev server and in the production build.
 */
function brandPlugin(): Plugin {
  const fill = (text: string) =>
    text.replaceAll('__BRAND_NAME__', BRAND.name).replaceAll('__BRAND_DESCRIPTION__', BRAND.description);
  const publicFiles: Record<string, string> = {
    '/manifest.json': 'application/manifest+json',
    '/firebase-messaging-sw.js': 'application/javascript',
  };
  let outDir = 'dist';
  return {
    name: 'brand-placeholders',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml(html) {
      return fill(html);
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0];
        const type = publicFiles[url];
        if (!type) return next();
        const file = path.join(server.config.publicDir, url);
        if (!fs.existsSync(file)) return next();
        res.setHeader('Content-Type', type);
        res.end(fill(fs.readFileSync(file, 'utf8')));
      });
    },
    closeBundle() {
      for (const url of Object.keys(publicFiles)) {
        const file = path.join(outDir, url);
        if (fs.existsSync(file)) fs.writeFileSync(file, fill(fs.readFileSync(file, 'utf8')));
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), brandPlugin()],
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
