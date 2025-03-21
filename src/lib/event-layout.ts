import type { components } from '@/api/schema'
type Camp = components['schemas']['Camp'] & { start_date: string; end_date: string } // 一時的な処置
type CampEvent = components['schemas']['Event']

const epoch = (timeString: string) => new Date(timeString).getTime()

const isMoment = (event: CampEvent) => event.time_start === event.time_end

// 日程によって events を仕分け、それぞれ開始日時（等しければ終了日時）でソートする
const sortDayEvents = (events: CampEvent[], camp: Camp) => {
  const sorted = [...events].sort((a, b) => {
    if (epoch(a.time_start) > epoch(b.time_start)) {
      return 1
    } else if (epoch(a.time_start) < epoch(b.time_start)) {
      return -1
    } else {
      return epoch(a.time_end) - epoch(b.time_end)
    }
  })

  // 合宿期間中の全ての date に対し、date と events をもつ配列 dayEvents を作成
  const dayEvents: { date: Date; events: CampEvent[] }[] = []
  const newDay = new Date(camp.start_date)

  for (const event of sorted) {
    while (epoch(event.time_start) >= newDay.getTime()) {
      dayEvents.push({ date: new Date(newDay), events: [] })
      newDay.setDate(newDay.getDate() + 1)
    }
    dayEvents[dayEvents.length - 1].events.push(event)
  }
  while (epoch(camp.end_date) >= newDay.getTime()) {
    dayEvents.push({ date: new Date(newDay), events: [] })
    newDay.setDate(newDay.getDate() + 1)
  }

  return dayEvents
}

export type EventPos = {
  startRow: number
  endRow: number
  column: number
  content: CampEvent
}

export type ScheduleRow = {
  time: Date
  minHeight: 'narrow' | 'wide' // その行の高さ
  stamp: 'none' | 'start' | 'center' // 時間の表示位置
  line: boolean
}

export type EventGroup = {
  columns: number // 列数
  spaces: ScheduleRow[] // 領域ごとの最小の表示高さ
  events: EventPos[]
  moments: EventPos[]
}

export type DayGroup = {
  date: Date
  eventGroups: EventGroup[]
}

// events を groups に仕分け、各 groups の列を決定する
const arrangeEvents = (events: CampEvent[], currentTime?: Date) => {
  const epochTimeSet = new Set<number>([
    ...Array.from(events, (event) => epoch(event.time_start)),
    ...Array.from(events, (event) => epoch(event.time_end)),
    ...(currentTime ? [currentTime.getTime()] : []),
  ])

  // それぞれのタイムスタンプに対応した要素をもつ配列 arranged
  const arranged: { time: Date; events: (CampEvent | null)[] }[] = Array.from(
    [...epochTimeSet].sort((a, b) => a - b), // 全てのタイムスタンプ（時系列順）
    (time) => ({ time: new Date(time), events: [] }),
  )

  // イベントの位置情報を記録する配列
  const eventPos: EventPos[] = []

  // arranged の瞬間イベントに対応する要素にイベントを追加
  for (const moment of events.filter((event) => isMoment(event))) {
    const index = arranged.findIndex((el) => el.time.getTime() === epoch(moment.time_start))
    arranged[index].events.push(moment)
  }

  // もし arranged の最初が瞬間イベントでなかった場合、見た目の調整のためにその手前に空の領域を追加
  if (arranged.length > 0 && arranged[0].events.length === 0) {
    arranged.unshift({ time: new Date(0), events: [] })
    // time は 1970/01/01 で全ての日付より手前に来ることが保証されている
  }

  // 連続する瞬間イベントの最後に空の要素を追加
  for (let i = arranged.length - 1; i > 0; i--) {
    if (arranged[i - 1].events.length === 1 && arranged[i].events.length === 0) {
      arranged.splice(i, 0, { time: arranged[i - 1].time, events: [] })
    }
  }

  // arranged を分割可能な場所の配列
  let groupBorder = [...new Array(arranged.length + 1).keys()]

  // arranged の要素数は定まったので、瞬間イベント以外のイベントも配置していく
  for (const event of events.filter((event) => !isMoment(event))) {
    let start = arranged.findIndex((el) => el.time.getTime() === epoch(event.time_start))
    if (start < arranged.length - 1 && arranged[start].time === arranged[start + 1].time) {
      start = start + 1
    }
    const end = arranged.findIndex((el) => el.time.getTime() === epoch(event.time_end))
    // console.log(`${event.name}: ${start} ~ ${end}`)

    // arranged における start から end までの時間に渡ってイベントがまだ存在しない列を探索
    let column = 0
    while (true) {
      for (let i = start; i < end; i++) {
        if (arranged[i].events.length <= column) {
          arranged[i].events.push(null)
        }
      }
      const arr = Array.from(arranged.slice(start, end), (el) => el.events[column])
      if (arr.some((el) => !!el)) {
        column++ // arr に null でない値が含まれている = すでにイベントが存在する
      } else {
        break
      }
    }

    // イベントの位置情報を配列に追加
    eventPos.push({ startRow: start, endRow: end, column: column, content: event })

    // arranged における start から end までの要素にイベント情報を追加する
    for (let i = start; i < end; i++) {
      arranged[i].events[column] = event
      if (i > start) {
        groupBorder = groupBorder.filter((el) => el !== i) // 分割不可能になったので取り除く
      }
    }
  }

  // eventPos に瞬間イベントの情報を追加
  for (let i = 0; i < arranged.length; i++) {
    if (arranged[i].events.length > 0 && arranged[i].events[0] !== null) {
      if (isMoment(arranged[i].events[0]!)) {
        eventPos.push({ startRow: i, endRow: i + 1, column: 0, content: arranged[i].events[0]! })
      }
    }
  }

  // それぞれのタイムスタンプの時間の情報を追加
  const times: ScheduleRow[] = Array.from(arranged, (el) => ({
    time: el.time,
    minHeight: 'wide',
    stamp: 'start',
    line: true,
  }))

  if (arranged.length > 0 && arranged[0].time.getTime() === 0) {
    times[0].stamp = 'none'
    times[0].minHeight = 'narrow'
    times[0].line = false
  }

  for (let i = 0; i < arranged.length; i++) {
    if (arranged[i].events.length > 0) {
      if (arranged[i].events[0] !== null && isMoment(arranged[i].events[0]!)) {
        times[i].stamp = 'center'
        times[i].line = false
        if (i + 1 < arranged.length) {
          times[i + 1].line = false
          times[i + 1].stamp = 'none'
          if (arranged[i + 1].events.length === 0) {
            times[i + 1].minHeight = 'narrow'
          }
        }
        if (i - 1 >= 0) {
          if (arranged[i - 1].events.length === 0) {
            times[i - 1].minHeight = 'narrow'
          }
        }
      } else if (i + 2 === arranged.length) {
        times[i + 1].minHeight = 'narrow'
      }
    }
  }

  // console.log(arranged)

  // この日の全ての event の配置の配列とイベントグループの境界番号の配列を返す
  return { events: eventPos, border: groupBorder, times: times }
  // 2 次元配列 arranged はイベントの分布を視覚化するために用いたが、
  // 最終的な返り値はイベントごとに配置の情報がまとまっている方が望ましい
}

// 日付 > イベントグループ（時間の重なるイベントの集まり） > イベント という配列を返す
export const getLayout = (events: CampEvent[], camp: Camp, currentTime: Date) => {
  const dayGroups: DayGroup[] = []
  const currentDate = new Date(currentTime)
  currentDate.setHours(0, 0, 0, 0)

  for (const day of sortDayEvents(events, camp)) {
    const eventGroups: EventGroup[] = []

    const result = arrangeEvents(
      day.events,
      day.date.getTime() === currentDate.getTime() ? currentTime : undefined,
    )

    const assign: number[] = [0] // この日の第 n 行にあるイベントは第 assign[n] グループに割り当てられる
    while (assign.length < result.border[result.border.length - 1]) {
      assign.push(assign[assign.length - 1] + (result.border.includes(assign.length) ? 1 : 0))
    }

    // 各イベントグループについて（result.border の各要素はイベントグループの始まりの位置を表す）
    for (let i = 0; i < result.border.length - 1; i++) {
      const groupEvents = result.events.filter((eventPos) => assign[eventPos.startRow] === i)
      for (let j = 0; j < groupEvents.length; j++) {
        groupEvents[j].startRow -= result.border[i]
        groupEvents[j].endRow -= result.border[i]
      } // その日の始まり基準 → そのグループの始まり基準

      eventGroups.push({
        columns: Math.max(...Array.from(groupEvents, (el) => el.column + 1), 0),
        spaces: result.times.slice(result.border[i], result.border[i + 1]),
        events: groupEvents.filter((event) => event.content.time_start !== event.content.time_end),
        moments: groupEvents.filter((event) => event.content.time_start === event.content.time_end),
      })
    }

    dayGroups.push({ date: day.date, eventGroups: eventGroups })
  }

  return dayGroups
}
