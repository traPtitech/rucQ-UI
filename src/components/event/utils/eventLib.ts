import type { CampEvent } from '@/typeAliases'

// イベントの開始時刻（瞬間イベントならその時刻）を返す
export const getStartTime = (event: CampEvent) => {
  return event.type === 'moment' ? new Date(event.time) : new Date(event.timeStart)
}

// イベントの終了時刻（瞬間イベントなら開始時刻）を返す
export const getEndTime = (event: CampEvent) => {
  return event.type === 'moment' ? new Date(event.time) : new Date(event.timeEnd)
}
