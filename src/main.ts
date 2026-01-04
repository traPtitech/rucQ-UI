import { createApp } from 'vue'
import router from '@/router'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { queryClient, queryCacheReady } from '@/lib/queryClient'
import { vuetify } from '@/lib/vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { useUserStore, useCampStore } from './store'
import { useRegisterSW } from 'virtual:pwa-register/vue'

import '@fontsource-variable/m-plus-2' // 'M PLUS 2 Variable'
import '@fontsource-variable/m-plus-code-latin' // 'M PLUS Code Latin Variable'
import '@fontsource-variable/reddit-sans' // 'Reddit Sans Variable'
import '@fontsource-variable/roboto' // 'Roboto Variable'

import App from './App.vue'
import './styles/main.scss'

const app = createApp(App)
const pinia = createPinia()

if (import.meta.env.DEV) {
  // 開発時だけ用いるtanstack queryのdevtools, キャッシュの中身が見れる
  app.component('VueQueryDevtools', VueQueryDevtools)
}

app.use(pinia)
app.use(vuetify)
app.use(VueQueryPlugin, { queryClient })

// ユーザーがタブに戻ってきた時、Service Worker の更新をチェック
let swUpdateListenerRegistered = false
useRegisterSW({
  onRegisteredSW(swUrl, r) {
    if (!r || swUpdateListenerRegistered) return
    swUpdateListenerRegistered = true
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('Checking for SW update...')
        r.update() // ブラウザに SW の更新を確認させる
        // vite.config.ts の workbox 設定により、見つかった新しい SW は即座に有効化される
      }
    })
  },
})

async function initializeApp() {
  if (import.meta.env.DEV && import.meta.env.MODE !== 'staging') {
    const { worker } = await import('./mocks/browser')
    await worker.start()
  }

  try {
    await queryCacheReady() // キャッシュの読み込み
    const userStore = useUserStore()
    const campStore = useCampStore()
    await userStore.initUser()
    await campStore.initCamp(userStore.user)
  } catch (error) {
    console.error(error)
  }

  app.use(router)
  app.mount('#app')
}

initializeApp().catch(console.error)
