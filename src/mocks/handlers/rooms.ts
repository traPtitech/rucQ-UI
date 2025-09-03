import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'

export const roomsHandlers = [
  http.get('/api/camps/{campId}/room-groups', async () => {
    return HttpResponse.json([
      {
        id: 1,
        name: '東棟 1F',
        rooms: [
          {
            id: 1,
            name: '101',
            members: [
              { id: 'mumumu', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'akimo', isStaff: true },
              { id: 'oxojo', isStaff: true },
              { id: 'ogu_kazemiya', isStaff: true },
              { id: 'Pugma', isStaff: true },
            ],
          },
          { id: 2, name: '102', members: [{ id: 'Kentaro1043', isStaff: true }] },
          { id: 3, name: '103', members: [{ id: '0mnado', isStaff: true }] },
          { id: 4, name: '104', members: [{ id: '24akitaka', isStaff: true }] },
        ],
      },
      {
        id: 2,
        name: '東棟 2F',
        rooms: [
          {
            id: 5,
            name: '201',
            members: [
              { id: '24B01559', isStaff: true },
              { id: '553iruka', isStaff: true },
              { id: '5u2umep1y0', isStaff: true },
              { id: 'Ak', isStaff: true },
            ],
          },
          { id: 6, name: '202', members: [{ id: 'akiaki', isStaff: true }] },
        ],
      },
      {
        id: 3,
        name: '東棟 3F',
        rooms: [
          {
            id: 7,
            name: '301',
            members: [
              { id: 'akiponggg0119', isStaff: true },
              { id: 'alex_python', isStaff: true },
              { id: 'anDromeDa', isStaff: true },
              { id: 'aruze_pino', isStaff: true },
              { id: 'Astarte', isStaff: true },
              { id: 'Aster', isStaff: true },
            ],
          },
          { id: 8, name: '302', members: [{ id: 'ayana', isStaff: true }] },
          { id: 9, name: '303', members: [{ id: 'barakin', isStaff: true }] },
          { id: 10, name: '304', members: [{ id: 'bekobeko', isStaff: true }] },
          { id: 11, name: '305', members: [{ id: 'blueleaf', isStaff: true }] },
          { id: 12, name: '306', members: [{ id: 'BN256', isStaff: true }] },
          { id: 13, name: '307', members: [{ id: 'ch4tla', isStaff: true }] },
          { id: 14, name: '308', members: [{ id: 'clcrEX', isStaff: true }] },
          {
            id: 15,
            name: '309',
            members: [{ id: 'Cooooooooooooooooooooooooooooody', isStaff: true }],
          },
        ],
      },
      {
        id: 4,
        name: '東棟 4F',
        rooms: [
          {
            id: 16,
            name: '401',
            members: [
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
            ],
          },
          {
            id: 17,
            name: '402',
            members: [
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
            ],
          },
          {
            id: 18,
            name: '403',
            members: [
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
            ],
          },
        ],
      },
    ])
  }),
]
