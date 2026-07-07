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
import localforage from 'localforage'

import '@fontsource-variable/m-plus-2' // 'M PLUS 2 Variable'
import '@fontsource-variable/m-plus-code-latin/wdth.css' // 'M PLUS Code Latin Variable' の幅広バリアント
import '@fontsource-variable/reddit-sans' // 'Reddit Sans Variable'
import '@fontsource-variable/roboto' // 'Roboto Variable'

import App from './App.vue'

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
  if (window.location.pathname === '/login') {
    if (import.meta.env.DEV) {
      // 開発環境の場合、/login にリダイレクトしても traQ 認証が挟まるわけではない
      // 無限ループしてしまうので、Cookie が適切に設定されているかどうかの確認を求め、
      // ここでアプリケーションを終了する

      alert(
        [
          '開発環境から Staging / Production API へのアクセスを試み、ログインに失敗しました。',
          'Cookie が環境変数として正しく設定されていないか、古すぎる可能性があります。',
        ].join(''),
      )
      return
    }

    // 本番環境の場合、サービスワーカーのキャッシュが更新されないことが問題であり、
    // /login にアクセス出来たことは再度 rucQ サーバーに接続できたことを意味するので、
    // トップページにリダイレクトする

    alert('ログインされました！ トップページにリダイレクトします')
    window.location.href = '/'
  }

  if (import.meta.env.DEV && import.meta.env.MODE === 'msw') {
    // 手動リロードによってキャッシュをクリア
    await localforage.clear()
    queryClient.clear()
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

  if (__COMMIT_HASH__) {
    console.log(`Commit Hash: ${__COMMIT_HASH__}`)
  }

  app.use(router)
  app.mount('#app')
}

initializeApp().catch(console.error)
