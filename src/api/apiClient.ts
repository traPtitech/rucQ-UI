import createClient from 'openapi-fetch'
import type { paths } from '@/api/schema'

const baseUrl = import.meta.env.VITE_API_BASE_URL
const devUser = import.meta.env.VITE_DEV_USER

// 開発環境用のヘッダー設定
const headers: Record<string, string> = {}
if (devUser) {
  headers['X-Forwarded-User'] = devUser
}

export const apiClient = createClient<paths>({
  baseUrl: baseUrl,
  headers: headers,
})
