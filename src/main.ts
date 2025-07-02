import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import App from './App.vue'

import './assets/style.css'

const app = createApp(App)
const pinia = createPinia()

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          // Core colors
          background: '#f6f6f6',
          surface: '#ffffff',
          primary: '#ff7300',
          secondary: '#444444',
          primaryLight: '#FFE5C9',

          // Standard Vuetify colors
          text: '#000000',
          error: '#ff4d00',
        },
      },
    },
  },
})

app.use(pinia)
app.use(router)
app.use(vuetify)

if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser')
  await worker.start()
}

import { useUserStore, useCampStore } from './store'

const me = await useUserStore().initUser()
await useCampStore().initCamp(me)

app.mount('#app')
