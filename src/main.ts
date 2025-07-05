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
          background: '#f6f6f6',
          surface: '#ffffff',
          primary: '#ff7300',
          secondary: '#444444',
          primaryLight: '#FFE5C9',
          text: '#000000',
          patternOnPrimary: '#FF8200',
        },
      },
    },
  },
})

app.use(pinia)
app.use(router)
app.use(vuetify)

import { useUserStore, useCampStore } from './store'

async function initializeApp() {
  if (import.meta.env.DEV) {
    // const { worker } = await import('./mocks/browser')
    // await worker.start()
    // await (await import('./dev/setup')).default()
  }

  const me = await useUserStore().initUser()
  try {
    await useCampStore().initCamp(me)
  } catch (error) {
    console.error(error)
  }

  app.mount('#app')
}

initializeApp().catch(console.error)
