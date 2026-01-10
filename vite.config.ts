import pkg from './package.json'
import { fileURLToPath, URL } from 'node:url'
import { execSync } from 'node:child_process'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const hash = execSync('git rev-parse --short HEAD').toString()
  console.log(`${pkg.version}, Commit Hash: ${hash}`)
  return {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __COMMIT_HASH__: JSON.stringify(hash),
    },
    plugins: [
      visualizer(),
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
          navigateFallbackDenylist: [/^\/api/, /^\/login/],
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
          : ({} as Record<string, string>),
    },
  }
})
