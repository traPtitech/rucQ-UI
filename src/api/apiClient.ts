import createClient from 'openapi-fetch'
import type { paths } from '@/api/schema'

const baseUrl = import.meta.env.VITE_BACKEND_ADDR || 'https://rucq.trap.show'
export const apiClient = createClient<paths>({
  baseUrl: baseUrl,
  headers: {
    'X-Forwarded-User': 'kitsne',
  },
})
