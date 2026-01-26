import createClient from 'openapi-fetch'
import type { paths } from '@/api/schema'

export const apiClient = createClient<paths>({ redirect: 'manual' })
