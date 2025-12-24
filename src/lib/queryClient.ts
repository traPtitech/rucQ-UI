declare const __APP_VERSION__: string
import { QueryClient } from '@tanstack/vue-query'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import localforage from 'localforage'

// キャッシュの設定
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 7 * 24 * 60 * 60 * 1000, // 1週間
      staleTime: 60 * 60 * 1000, // 1h
    },
  },
})

const asyncPersister = createAsyncStoragePersister({
  storage: localforage,
})

// @tanstack/query-persist-client-core/src/persist.ts の実装によると
// persistQueryClient = persistQueryClientRestore + persistQueryClientSubscribe
// 第二引数にキャッシュ復元の完了を待つ Promise を返す
export const [, restorePromise] = persistQueryClient({
  queryClient,
  persister: asyncPersister,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 永続化キャッシュの寿命を 1 週間に設定
  buster: __APP_VERSION__, // package.json のバージョンを自動反映
})
