import type { components } from '@/api/schema'

type ActivityResponse = components['schemas']['ActivityResponse']

export const activities: ActivityResponse[] = [
  {
    id: 1,
    type: 'room_created',
    time: '2024-07-01T10:00:00+09:00',
  },
  {
    id: 2,
    type: 'payment_paid_changed',
    time: '2024-07-01T12:30:00+09:00',
    amount: 15000,
  },
  {
    id: 3,
    type: 'roll_call_created',
    time: '2024-07-02T14:00:00+09:00',
    rollCallId: 2,
    name: '大学出発時点呼',
    isSubject: true,
    answered: true,
  },
  {
    id: 4,
    type: 'roll_call_created',
    time: '2024-07-02T14:00:00+09:00',
    rollCallId: 3,
    name: '宿到着時点呼',
    isSubject: true,
    answered: false,
  },
  {
    id: 5,
    type: 'roll_call_created',
    time: '2024-07-02T14:00:00+09:00',
    rollCallId: 4,
    name: 'バスを使わなかった人の点呼',
    isSubject: false,
    answered: false,
  },
  {
    id: 6,
    type: 'question_created',
    time: '2024-07-01T15:30:00+09:00',
    questionGroupId: 1,
    name: 'バス',
    due: '2024-07-01',
    needsResponse: false,
  },
]
