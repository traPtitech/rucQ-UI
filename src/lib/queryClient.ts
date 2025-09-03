import {  QueryClient } from '@tanstack/vue-query'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import localforage from 'localforage'

// キャッシュの設定
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 24 * 60 * 60 * 1000, // 24h
      staleTime: 60 * 60 * 1000, // 1h
    },
  },
})

const asyncPersister = createAsyncStoragePersister({
  storage: localforage,
})

persistQueryClient({
  queryClient,
  persister: asyncPersister,
  maxAge: 24 * 60 * 60 * 1000, // キャッシュの寿命
  buster: 'v1', // APIやスキーマが変わったら更新
})
