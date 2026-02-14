import pkg from './package.json'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, type PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const hash = env.COMMIT_HASH?.slice(0, 7)
  // 環境変数からコミットハッシュの先頭 7 文字を取得

  if (hash) console.log(`v${pkg.version}, hash: ${hash}`)

  return {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __COMMIT_HASH__: hash ? JSON.stringify(hash) : undefined,
    },
    plugins: [
      visualizer() as PluginOption,
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
          theme_color: '#ffffff',
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
          disableDevLogs: true, // workbox のログを無効化
          globPatterns: ['**/*.{js,css,html,svg,png,jpg,webp,woff2}'],
          navigateFallbackDenylist: [/^\/api/, /^\/login/],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/q\.trap\.jp\/api\/v3\/public\/icon\/.*/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'user-icons',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 7 * 24 * 60 * 60, // 1 週間
                },
                cacheableResponse: {
                  statuses: [200],
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
                headers: {
                  Cookie: env.STAGING_COOKIE,
                },
              },
            }
          : mode === 'development'
            ? {
                '/api': {
                  target: 'http://localhost:8080',
                  changeOrigin: true,
                  configure: (proxy) => {
                    proxy.on('proxyReq', (proxyReq) => {
                      const traqId = env.MY_TRAQ_ID
                      if (traqId) proxyReq.setHeader('X-Forwarded-User', traqId)
                    })
                  },
                },
              }
            : ({} as Record<string, string>),
    },
  }
})
