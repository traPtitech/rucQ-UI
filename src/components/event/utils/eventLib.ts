import { MomentEventResponseType } from '@/api/generated/client.schemas'
import type { EventResponse as CampEvent } from '@/api/generated/client.schemas'
// イベントの開始時刻（瞬間イベントならその時刻）を返す
export const getStartTime = (event: CampEvent) => {
  return event.type === MomentEventResponseType.moment
    ? new Date(event.time)
    : new Date(event.timeStart)
}

// イベントの終了時刻（瞬間イベントなら開始時刻）を返す
export const getEndTime = (event: CampEvent) => {
  return event.type === MomentEventResponseType.moment
    ? new Date(event.time)
    : new Date(event.timeEnd)
}
