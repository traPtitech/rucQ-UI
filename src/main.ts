import { createApp } from 'vue'
import router from '@/router'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { queryClient } from '@/lib/queryClient'
import { vuetify } from '@/lib/vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

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

import { useUserStore, useCampStore } from './store'

async function initializeApp() {
  if (import.meta.env.DEV && import.meta.env.MODE !== 'staging') {
    const { worker } = await import('./mocks/browser')
    await worker.start()
    // await (await import('./dev/setup')).default()
  }

  try {
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
