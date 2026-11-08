import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    base: '/LearnSmart/',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'service-worker-scope-headers',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            // Redirect root to /LearnSmart/ in dev mode
            if (req.url === '/') {
              res.writeHead(302, { Location: '/LearnSmart/' });
              res.end();
              return;
            }
            if (
              req.url === '/sw.js' ||
              req.url === '/LearnSmart/sw.js' ||
              req.url?.startsWith('/sw.js?') ||
              req.url?.startsWith('/LearnSmart/sw.js?')
            ) {
              res.setHeader('Content-Type', 'text/javascript');
              res.setHeader('Service-Worker-Allowed', '/LearnSmart/');
              const swPath = path.resolve('public/sw.js');
              if (fs.existsSync(swPath)) {
                res.end(fs.readFileSync(swPath, 'utf-8'));
                return;
              }
            }
            if (
              req.url?.startsWith('/dev-dist/sw.js') ||
              req.url?.startsWith('/LearnSmart/dev-dist/sw.js')
            ) {
              res.setHeader('Service-Worker-Allowed', '/LearnSmart/');
            }
            next();
          });
        }
      },
      VitePWA({
        registerType: 'autoUpdate',
        manifestFilename: 'manifest.json',
        includeAssets: [
          'favicon.ico',
          'apple-touch-icon.png',
          'icon.svg',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png'
        ],
        manifest: {
          id: '/LearnSmart/',
          name: 'LearnSmart – Learn, Explore and Grow!',
          short_name: 'LearnSmart',
          description: 'An interactive, inclusive educational learning app designed for young learners, beginners, and neurodivergent learners.',
          theme_color: '#1976D2',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'any',
          start_url: '/LearnSmart/',
          scope: '/LearnSmart/',
          categories: ['education', 'kids'],
          icons: [
            {
              src: '/LearnSmart/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/LearnSmart/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/LearnSmart/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-stylesheets',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'app-images-cache',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module'
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
