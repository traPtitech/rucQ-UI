import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'

export const rollCallsHandlers = [
  http.get('/api/camps/{campId}/roll-calls', async () => {
    return HttpResponse.json([
      {
        id: 1,
        name: 'バス乗車の点呼',
        description: 'どのバスに乗ったか教えてください！',
        options: ['1号車', '2号車', '3号車'],
        subjects: ['traP'],
      },
    ])
  }),
]
