import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import App from './App.vue'

import './styles/main.scss'

const app = createApp(App)
const pinia = createPinia()

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
const vuetify = createVuetify({
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
          line: '#C0C0C0',
          orange: '#FB8C00', // Vuetify の orange-darken-1
          pink: '#FF80AB', // Vuetify の pink-accent-1
        },
      },
    },
  },
})

app.use(pinia)
app.use(vuetify)

import { useUserStore, useCampStore } from './store'

async function initializeApp() {
  if (import.meta.env.DEV && import.meta.env.MODE !== 'staging') {
    const { worker } = await import('./mocks/browser')
    await worker.start()
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
