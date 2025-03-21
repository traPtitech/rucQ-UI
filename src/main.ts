import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import App from './App.vue'

import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

// Vuetify
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
          black: '#000000',
          darkGray: '#444444',
          gray: '#aaaaaa',
          lightGray: '#e0e0e0',
          white: '#f6f6f6',
          exwhite: '#ffffff',

          ash: '#444444', // darkGray に同じ。イベントの色名はこっちを採用
          ashPale: '#e0e0e0', // lightGray に同じ

          orange: '#ff7300',
          orangePale: '#ffe2b2',
          green: '#178000',
          greenPale: '#acf69c',
          red: '#ff4d00',
          redPale: '#ffc9b2',
          blue: '#008cff',
          bluePale: '#9dd8ff',
          navy: '#2444a4',
          navyPale: '#afc3ff',
          purple: '#7210C8',
          purplePale: '#DEB9FF',
          pink: '#EE4DBE',
          pinkPale: '#FFB6E9',

          theme: '#ff7300',
          themePale: '#ffe2b2',

          text: '#000000', // var(--color-black)
          background: '#f6f6f6', // var(--color-background)
          surface: '#f6f6f6',
          primary: '#ff7300', // var(--color-orange)
          secondary: '#ffe2b2', // var(--color-orange-pale)
          error: '#ff4d00', // var(--color-red)
        },
      },
    },
  },
})

// 調べた限りでは、Vuetify のテーマ設定は基本的にこの createVuetify の中をいじって行うらしい
// base.css の色定義が必要な場面も多いので、どうにか同期させられたら嬉しいんだけれdお

app.use(pinia)
app.use(router)
app.use(vuetify)

import { useUserStore, useCampStore } from './store'

const initApp = async () => {
  useUserStore().initUser()
  useCampStore().initCamp()
  app.mount('#app')
}

initApp()
