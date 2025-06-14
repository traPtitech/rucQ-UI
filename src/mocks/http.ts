import { createOpenApiHttp } from 'openapi-msw'
import type { paths } from '@/api/schema'

export const http = createOpenApiHttp<paths>()
