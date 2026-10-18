import { HttpResponse, http } from 'msw'
import { activities } from '@/mocks/activities'

export const activitiesHandlers = [
  http.get('/api/camps/:campId/activities', () => {
    return HttpResponse.json(activities)
  }),
]
