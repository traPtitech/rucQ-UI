import { createApp } from 'vue'
import router from '@/router'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { queryClient, restorePromise } from '@/lib/queryClient'
import { vuetify } from '@/lib/vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { useUserStore, useCampStore } from './store'

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

async function initializeApp() {
  if (import.meta.env.DEV && import.meta.env.MODE !== 'staging') {
    const { worker } = await import('./mocks/browser')
    await worker.start()
  }

  try {
    await restorePromise // キャッシュの読み込み
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
