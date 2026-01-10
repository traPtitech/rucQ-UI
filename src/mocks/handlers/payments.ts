import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'

export const paymentsHandlers = [
  http.get('/api/camps/{campId}/me', ({ params }) => {
    return HttpResponse.json({
      id: 'traP',
      payment: {
        id: 1,
        userId: 'traP',
        campId: Number(params.campId),
        amount: 5000,
        amountPaid: 5000,
      },
      room: {
        id: 1,
        name: '301',
        members: [
          { id: 'kitsne', isStaff: true },
          { id: 'kitsne', isStaff: true },
          { id: 'traP', isStaff: true },
        ],
      },
    })
  }),
]
