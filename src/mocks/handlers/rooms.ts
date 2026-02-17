import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'

export const roomsHandlers = [
  http.get('/api/camps/{campId}/room-groups', () => {
    return HttpResponse.json([
      {
        id: 1,
        name: '東棟 1F',
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
            status: { type: 'active', topic: '点呼実施中' },
          },
          {
            id: 2,
            name: '102',
            members: [{ id: 'kitsne', isStaff: true }],
            status: { type: null, topic: '' },
          },
          {
            id: 3,
            name: '103',
            members: [{ id: 'kitsne', isStaff: true }],
            status: { type: 'inactive', topic: '応答待ち' },
          },
          {
            id: 4,
            name: '104',
            members: [{ id: 'kitsne', isStaff: true }],
            status: { type: null, topic: '' },
          },
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
              { id: 'kitsne', isStaff: true },
              { id: 'traP', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
            ],
            status: { type: 'active', topic: '荷物受け取り' },
          },
          {
            id: 6,
            name: '202',
            members: [{ id: 'kitsne', isStaff: true }],
            status: { type: null, topic: '' },
          },
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
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
              { id: 'kitsne', isStaff: true },
            ],
            status: { type: 'inactive', topic: '外出中' },
          },
          {
            id: 8,
            name: '302',
            members: [{ id: 'kitsne', isStaff: true }],
            status: { type: null, topic: '' },
          },
          {
            id: 9,
            name: '303',
            members: [{ id: 'kitsne', isStaff: true }],
            status: { type: null, topic: '' },
          },
          {
            id: 10,
            name: '304',
            members: [{ id: 'kitsne', isStaff: true }],
            status: { type: 'active', topic: 'チェックイン済み' },
          },
          {
            id: 11,
            name: '305',
            members: [{ id: 'kitsne', isStaff: true }],
            status: { type: null, topic: '' },
          },
          {
            id: 12,
            name: '306',
            members: [{ id: 'kitsne', isStaff: true }],
            status: { type: null, topic: '' },
          },
          {
            id: 13,
            name: '307',
            members: [{ id: 'kitsne', isStaff: true }],
            status: { type: 'inactive', topic: '移動中' },
          },
          {
            id: 14,
            name: '308',
            members: [{ id: 'kitsne', isStaff: true }],
            status: { type: null, topic: '' },
          },
          {
            id: 15,
            name: '309',
            members: [{ id: 'kitsne', isStaff: true }],
            status: { type: null, topic: '' },
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
            status: { type: 'active', topic: '体調確認' },
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
            status: { type: null, topic: '' },
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
            status: { type: 'inactive', topic: '消灯後' },
          },
        ],
      },
    ])
  }),
]
