import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'

export const roomsHandlers = [
  http.get('/api/camps/{campId}/room-groups', async () => {
    return HttpResponse.json([
      {
        id: 1,
        name: '1階',
        rooms: [
          { id: 1, name: '101', members: [{ id: 'traP', isStaff: true }] },
          { id: 2, name: '102', members: [{ id: 'traP', isStaff: true }] },
          { id: 3, name: '103', members: [{ id: 'traP', isStaff: true }] },
          { id: 4, name: '104', members: [{ id: 'traP', isStaff: true }] },
        ],
      },
      {
        id: 2,
        name: '2階',
        rooms: [
          { id: 5, name: '201', members: [{ id: 'traP', isStaff: true }] },
          { id: 6, name: '202', members: [{ id: 'traP', isStaff: true }] },
        ],
      },
    ])
  }),
]
