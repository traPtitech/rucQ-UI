import type { components } from '@/api/schema'
import { DayEventGrid, type EventGroup } from '@/lib/event-grid'
import { getStartTime, getEndTime } from '@/lib/event-lib'
import { getJSTDate } from '@/lib/date'

type Camp = components['schemas']['CampResponse']
type MomentEvent = components['schemas']['MomentEventResponse']
type DurationEvent = components['schemas']['DurationEventResponse']
type OfficialEvent = components['schemas']['OfficialEventResponse']
type CampEvent = MomentEvent | DurationEvent | OfficialEvent

export type DayEventGroups = {
  date: Date
  eventGroups: EventGroup[]
}

// events をグリッド上に配置し、日付ごと > まとまりごとに返す
export const getLayout = (events: CampEvent[], camp: Camp) => {
  return getDaysWithEvents(events, camp).map((day) => {
    const eventGroups = arrangeEvents(
      day.date,
      day.events,
      undefined,
      // TODO: 現在時刻がその日に含まれているなら表示に含める
    )
    return { date: day.date, eventGroups } as DayEventGroups
  })
}

// 日程によって events を仕分ける
const getDaysWithEvents = (events: CampEvent[], camp: Camp) => {
  const daysWithEvents: { date: Date; events: CampEvent[] }[] = []

  for (
    let currentDate = getJSTDate(camp.dateStart);
    currentDate.getTime() <= getJSTDate(camp.dateEnd).getTime();
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    daysWithEvents.push({
      date: new Date(currentDate), // currentDate を複製
      events: events.filter((event) => {
        // currentDate に開始するイベントを抽出
        return getStartTime(event).setHours(0, 0, 0, 0) === currentDate.getTime()
      }),
    })
  }

  return daysWithEvents
}

// ある日の events を groups に仕分け、各 groups の列を決定する
const arrangeEvents = (date: Date, events: CampEvent[], currentTime?: Date) => {
  // イベントの開始、終了など変化が生じうるタイムスタンプをセットにする
  const timeStampSet = new Set<number>([
    ...Array.from(events, (event) => getStartTime(event).getTime()),
    ...Array.from(events, (event) => getEndTime(event).getTime()),
    ...(currentTime ? [currentTime.getTime()] : []), // 合宿期間中なら現在時刻も表示に含める
  ])

  const grid = new DayEventGrid(date, timeStampSet)

  // 瞬間イベントをグリッドに追加
  events
    .filter((event) => event.type === 'moment')
    .sort((a, b) => getStartTime(a).getTime() - getStartTime(b).getTime())
    .forEach((event) => {
      grid.addMomentEvent(event)
    })

  // 期間イベントをグリッドに追加
  events
    .filter((event) => event.type !== 'moment')
    .sort((a, b) => {
      const startDelta = getStartTime(a).getTime() - getStartTime(b).getTime()
      const endDelta = getEndTime(a).getTime() - getEndTime(b).getTime()
      return startDelta !== 0 ? startDelta : endDelta
    })
    .forEach((event) => {
      grid.addDurationEvent(event)
    })

  return grid.export()
}
