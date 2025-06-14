import { campsHandlers } from './camps'
import { eventsHandlers } from './events'
import { imagesHandlers } from './images'
import { paymentsHandlers } from './payments'
import { questionsHandlers } from './questions'
import { rollCallsHandlers } from './rollCalls'
import { roomsHandlers } from './rooms'
import { usersHandlers } from './users'

export const handlers = [
  ...campsHandlers,
  ...eventsHandlers,
  ...imagesHandlers,
  ...paymentsHandlers,
  ...questionsHandlers,
  ...rollCallsHandlers,
  ...roomsHandlers,
  ...usersHandlers,
]
