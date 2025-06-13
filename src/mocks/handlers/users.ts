import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'
import type { components } from '@/api/schema'

type UserResponse = components['schemas']['UserResponse']

const myID = import.meta.env.MY_TRAQ_ID || 'kitsne'

export const usersHandlers = [
  http.get('/api/me', async () => {
    return HttpResponse.json({ id: myID, isStaff: true } as UserResponse, { status: 200 })
  }),
]
