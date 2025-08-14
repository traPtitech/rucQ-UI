import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'

export const roomsHandlers = [
  http.get('/api/camps/{campId}/room-groups', async () => {
    return HttpResponse.json([
      {
        id: 1,
        name: '東棟 2F',
        rooms: [
          {
            id: 1,
            name: '101',
            members: [
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
            ],
          },
          { id: 2, name: '102', members: [{ id: 'kitsne', isStaff: true }] },
          { id: 3, name: '103', members: [{ id: 'kitsne', isStaff: true }] },
          { id: 4, name: '104', members: [{ id: 'kitsne', isStaff: true }] },
        ],
      },
      {
        id: 2,
        name: '東棟 3F',
        rooms: [
          {
            id: 5,
            name: '201',
            members: [
              { id: 'kitsne', isStaff: true },
              { id: 'traP', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
            ],
          },
          { id: 6, name: '202', members: [{ id: 'kitsne', isStaff: true }] },
        ],
      },
    ])
  }),
]
