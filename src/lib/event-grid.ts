import type { components } from '@/api/schema'
import { getStartTime, getEndTime } from '@/lib/event-lib'

type MomentEvent = components['schemas']['MomentEventResponse']
type DurationEvent = components['schemas']['DurationEventResponse']
type OfficialEvent = components['schemas']['OfficialEventResponse']
type CampEvent = MomentEvent | DurationEvent | OfficialEvent

export type GridRow = { events: (CampEvent | null)[] } & (
  | { type: 'stamp'; time: Date }
  | { type: 'period'; timeStart: Date; timeEnd: Date }
)

export type DurationEventPos = {
  column: number
  startRow: number
  endRow: number
  event: DurationEvent | OfficialEvent
}

export type MomentEventPos = {
  // column は常に 0
  row: number
  event: MomentEvent
}

export type EventGroup = {
  columns: number // 列数
  rows: GridRow[] // 領域ごとの最小の表示高さ
  durationEvents: DurationEventPos[]
  momentEvents: MomentEventPos[]
}

// 日のイベントを表形式で表現
export class DayEventGrid {
  date: Date
  rows: GridRow[]

  // イベントのグリッド行を初期化。すべての stamp と、それらの間の period からなる
  constructor(date: Date, stamps: Set<number>) {
    this.date = date
    this.rows = Array.from(stamps)
      .sort((a, b) => a - b)
      .flatMap((stamp, index, array): GridRow[] => {
        if (index === array.length - 1) {
          return [{ events: [], type: 'stamp', time: new Date(stamp) }]
        } else {
          return [
            { events: [], type: 'stamp', time: new Date(stamp) },
            {
              events: [],
              type: 'period',
              timeStart: new Date(stamp),
              timeEnd: new Date(array[index + 1]),
            },
          ]
        }
      })
  }

  // ある時刻のグリッド行を取得
  _getStampIndex(time: Date): number {
    const index = this.rows.findIndex((row) => {
      return row.type === 'stamp' && row.time.getTime() === time.getTime()
    })
    if (index < 0) {
      throw new Error(`グリッド行に時刻が見つかりません: ${time}`)
    }
    return index
  }

  // グリッド行に瞬間のイベントを追加。必ず addDurationEvent に先駆けて呼ぶ
  addMomentEvent(event: MomentEvent) {
    const stampIndex = this._getStampIndex(getStartTime(event))
    const targetRow = this.rows[stampIndex]
    targetRow.events.push(event)
  }

  // グリッド行に期間のあるイベントを追加
  addDurationEvent(event: DurationEvent | OfficialEvent) {
    const startIndex = this._getStampIndex(getStartTime(event)) + 1 // 開始時刻の次の period 行から
    const endIndex = this._getStampIndex(getEndTime(event)) // 終了時刻の前の period 行まで

    const targetRows = this.rows.slice(startIndex, endIndex)

    // 最初の列から順に確認し、すべて null の列があればそこにイベントを追加
    for (let col = 0; ; col++) {
      if (
        targetRows.every((row) => {
          while (col >= row.events.length) row.events.push(null)
          return row.events[col] === null
        })
      ) {
        // すべての行の col 番目が null ならそこに追加
        targetRows.forEach((row) => {
          row.events[col] = event
        })
        break
      }
    }
  }

  // グリッドをエクスポート
  export(): EventGroup[] {
    const groups: EventGroup[] = []
    let currentGroup: GridRow[] = []

    // イベントの途切れ目でグループ分け
    for (const row of this.rows) {
      if (row.events.some((event) => event !== null && event.type !== 'moment')) {
        currentGroup.push(row) // 期間イベントがある行は現在のグループに追加
      } else {
        if (currentGroup.length > 0) {
          groups.push(this._exportGroup(currentGroup))
        }
        groups.push(this._exportGroup([row])) // 瞬間イベントの行も新しいグループとして追加
        currentGroup = []
      }
    }

    if (currentGroup.length > 0) {
      groups.push(this._exportGroup(currentGroup))
    }

    return groups
  }

  _exportGroup(rows: GridRow[]): EventGroup {
    const durationEvents: DurationEventPos[] = []
    const momentEvents: MomentEventPos[] = []
    const prosessedEvents = new Set<CampEvent>()

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex]

      // 各行の各列を確認
      for (let colIndex = 0; colIndex < row.events.length; colIndex++) {
        const event = row.events[colIndex]

        if (event && !prosessedEvents.has(event)) {
          prosessedEvents.add(event)

          if (event.type === 'moment') {
            momentEvents.push({ row: rowIndex, event: event })
          } else {
            // 期間イベントの場合、開始行と終了行を特定
            const groupIndex = this.rows.findIndex((r) => r === rows[0])
            const startRowIndex = this._getStampIndex(getStartTime(event)) + 1 - groupIndex
            const endRowIndex = this._getStampIndex(getEndTime(event)) - groupIndex

            durationEvents.push({
              column: colIndex,
              startRow: startRowIndex,
              endRow: endRowIndex,
              event: event,
            })
          }
        }
      }
    }

    return {
      columns: Math.max(...rows.map((row) => row.events.length)),
      rows: rows,
      durationEvents,
      momentEvents,
    }
  }
}
