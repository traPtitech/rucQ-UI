import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'
import type { components } from '@/api/schema'

type CampResponse = components['schemas']['CampResponse']

export const campsHandlers = [
  http.get('/api/camps', async () => {
    const camp = {
      id: 1,
      displayId: 'camp25_summer',
      name: '2025年度 夏合宿',
      description: '2025年度の夏合宿です！ これは合宿のしおりです！',
      isDraft: false,
      isRegistrationOpen: true,
      isPaymentOpen: true,
    }
    return HttpResponse.json([camp] as CampResponse[], { status: 200 })
  }),
]
