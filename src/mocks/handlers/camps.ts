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
        dateStart: '2025-08-01',
        dateEnd: '2025-08-10',
      },
      {
        id: 2,
        displayId: 'camp26_summer',
        name: '2026年度 夏合宿',
        description: '2026年度の夏合宿です！ これは合宿のしおりです！',
        isDraft: false,
        isRegistrationOpen: true,
        isPaymentOpen: true,
        dateStart: '2026-09-01',
        dateEnd: '2026-09-10',
      },
    ])
  }),
]
