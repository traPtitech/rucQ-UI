import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      workbox: {
        // 追加
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // キャッシュ上限 5 MB
        globPatterns: ['**/*.{css,html,ico,js,png,jpg,jpeg,svg,gif,webp,webmanifest}'], // プリキャッシュ
        runtimeCaching: [
          {
            urlPattern: /\/api\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60,
              },
            },
          },
        ],
      },
      manifest: {
        name: 'rucQ',
        short_name: 'rucQ',
        description: 'traP の合宿総合アプリ',
        theme_color: '#ff7300',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
    hmr: {
      host: 'localhost',
      port: 5173,
      protocol: 'ws',
    },
  },
})
