import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      vueDevTools(),
      vuetify({
        styles: {
          configFile: 'src/styles/settings.scss',
        },
      }),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'rucQ',
          short_name: 'rucQ',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/icons/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icons/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/icons/android-chrome-192x192-maskable.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/icons/android-chrome-512x512-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        includeAssets: [
          'favicon.ico',
          'apple-touch-icon.png',
          'android-chrome-192x192.png',
          'android-chrome-512x512.png',
          'android-chrome-192x192-maskable.png',
          'android-chrome-512x512-maskable.png',
          'icon-transparent.svg',
          'logo.svg',
          'logo-bg.svg',
          'logo-white.svg',
        ],
        // Service Worker
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,jpg,webp,woff2}'],
          runtimeCaching: [
            {
              // フォント
              urlPattern: ({ request }) => request.destination === 'font',
              handler: 'CacheFirst',
              options: {
                cacheName: 'fonts-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1年
                },
              },
            },
          ],
        },
        devOptions: { enabled: true },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy:
        mode === 'staging'
          ? {
              '/api': {
                target: 'https://rucq-dev.trapti.tech',
                changeOrigin: true,
              },
            }
          : ({} as Record<string, string>),
    },
  }
})
