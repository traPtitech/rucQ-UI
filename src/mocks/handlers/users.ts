import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'

export const usersHandlers = [
  http.get('/api/me', async () => {
    return HttpResponse.json({ id: 'traP', isStaff: true })
  }),
]
