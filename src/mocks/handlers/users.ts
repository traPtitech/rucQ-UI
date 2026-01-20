import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'

export const usersHandlers = [
  http.get('/api/me', () => {
    return HttpResponse.json({ id: 'traP', isStaff: true })
  }),
  http.get('/api/camps/{campId}/participants', () => {
    // return HttpResponse.json([{ id: 'traP', isStaff: true }])
    return HttpResponse.json([])
  }),
  http.put('/api/admin/users/{userId}', ({ params }) => {
    return HttpResponse.json({
      id: params.userId,
      isStaff: true,
    })
  }),
]
