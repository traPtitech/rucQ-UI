import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig(({ mode }) => {
  return {
    plugins: [vue(), vueDevTools(), vuetify()],
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
                target: 'https://rucq-dev.trap.show',
                changeOrigin: true,
              },
            }
          : ({} as Record<string, string>),
    },
  }
})
