import { RoomStatusType } from '@/api/generated/client.schemas'
import { HttpResponse, http } from 'msw'

export const paymentsHandlers = [
  http.get('/api/camps/:campId/me', ({ params }) => {
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
        status: { type: RoomStatusType.active, topic: '点呼実施中' },
      },
    })
  }),
]
