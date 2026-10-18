import { createApp } from 'vue'
import router from '@/router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { queryClient, restorePromise } from '@/api/queryClient'
import { vuetify } from '@/lib/vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import {
  getGetMeQueryOptions,
  getGetCampsQueryOptions,
  getGetCampParticipantsQueryOptions,
} from '@/api/generated/client'
import { authFetch } from '@/api/auth'
import { getLatestCamp } from '@/composables/camps'

import '@fontsource-variable/m-plus-2' // 'M PLUS 2 Variable'
import '@fontsource-variable/m-plus-code-latin/wdth.css' // 'M PLUS Code Latin Variable' の幅広バリアント
import '@fontsource-variable/reddit-sans' // 'Reddit Sans Variable'
import '@fontsource-variable/roboto' // 'Roboto Variable'

import App from './App.vue'

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const app = createApp(App)

if (import.meta.env.DEV) {
  // 開発時だけ用いるtanstack queryのdevtools, キャッシュの中身が見れる
  app.component('VueQueryDevtools', VueQueryDevtools)
}

app.use(vuetify)
app.use(VueQueryPlugin, { queryClient })

async function initializeApp() {
  if (window.location.pathname === '/login') {
    alert('ログインされました！ トップページにリダイレクトします')
    window.location.href = '/'
    return
  }

  if (import.meta.env.DEV && import.meta.env.MODE === 'msw') {
    const controller = navigator.serviceWorker.controller

    // 現在のページが PWA の Worker に制御されている場合は、登録を解除して制御を外す。
    if (controller && new URL(controller.scriptURL).pathname !== '/mockServiceWorker.js') {
      const registration = await navigator.serviceWorker.getRegistration()

      if (registration) {
        await registration.unregister()
      }

      window.location.reload()
      return
    }

    const { startWorker } = await import('./mocks/browser')
    await startWorker()
  }

  try {
    await restorePromise // キャッシュの読み込み
    await queryClient.ensureQueryData({
      ...getGetMeQueryOptions({ fetcher: authFetch }),
      revalidateIfStale: true,
    })
    const camps = await queryClient.ensureQueryData(getGetCampsQueryOptions())
    const latestCamp = getLatestCamp(camps)
    if (!latestCamp) throw new Error('表示可能な合宿がありません')
    await queryClient.ensureQueryData(getGetCampParticipantsQueryOptions(latestCamp.id))
  } catch (error) {
    console.error(error)
  }

  if (__COMMIT_HASH__) {
    console.log(`Commit Hash: ${__COMMIT_HASH__}`)
  }

  app.use(router)
  app.mount('#app')
}

initializeApp().catch(console.error)
