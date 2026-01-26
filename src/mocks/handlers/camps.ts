import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'

export const campsHandlers = [
  http.get('/api/camps', () => {
    return HttpResponse.json([])
  }),
  http.post('/api/camps/{campId}/register', ({ params }) => {
    return HttpResponse.json({ message: `Successfully registered for camp ${params.campId}` })
  }),
]
