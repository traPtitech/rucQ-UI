import createClient from 'openapi-fetch'
import type { paths } from '@/api/schema'

// 開発環境用のヘッダー設定
const headers: Record<string, string> = {}
if (import.meta.env.DEV) {
  headers['X-Forwarded-User'] = import.meta.env.VITE_DEV_USER
}

export const apiClient = createClient<paths>({
  headers: headers,
})
