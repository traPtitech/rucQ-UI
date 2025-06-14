import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'

export const campsHandlers = [
  http.get('/api/camps', async () => {
    return HttpResponse.json([
      {
        id: 1,
        displayId: 'camp25_summer',
        name: '2025年度 夏合宿',
        description: '2025年度の夏合宿です！ これは合宿のしおりです！',
        isDraft: false,
        isRegistrationOpen: true,
        isPaymentOpen: true,
      },
    ])
  }),
]
