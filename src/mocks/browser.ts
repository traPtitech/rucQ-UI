import { setupWorker } from 'msw/browser'
import { handlers } from './handlers/index'

export const worker = setupWorker(...handlers)

export const startWorker = () =>
  worker.start({
    // Vite の仮想モジュール（`/@id/...`）も Service Worker を通る。API の取りこぼしだけを
    // 警告対象にして、初回の画面遷移で発生する開発用アセットや外部アセットの警告を抑える。
    onUnhandledRequest(request, print) {
      const url = new URL(request.url)
      if (url.origin === window.location.origin && url.pathname.startsWith('/api/')) print.warning()
    },
  })
