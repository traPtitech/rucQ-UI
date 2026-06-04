import { HttpResponse } from 'msw'
import { http } from '@/mocks/http'
import { activities } from '@/mocks/activities'

export const activitiesHandlers = [
  http.get('/api/camps/{campId}/activities', () => {
    return HttpResponse.json(activities)
  }),
]
