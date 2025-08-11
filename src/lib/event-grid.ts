import type { components } from '@/api/schema'
import { getStartTime, getEndTime } from '@/lib/event-lib'

type MomentEvent = components['schemas']['MomentEventResponse']
type DurationEvent = components['schemas']['DurationEventResponse']
type OfficialEvent = components['schemas']['OfficialEventResponse']
type CampEvent = MomentEvent | DurationEvent | OfficialEvent

type GridRow = { events: (CampEvent | null)[] } & (
  | { type: 'stamp'; time: Date }
  | { type: 'period'; timeStart: Date; timeEnd: Date }
)

type DurationEventPos = {
  column: number
  startRow: number
  endRow: number
  event: DurationEvent | OfficialEvent
}

type MomentEventPos = {
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
    const endIndex = this._getStampIndex(getEndTime(event)) - 1 // 終了時刻の前の period 行まで

    const targetRows = this.rows.slice(startIndex, endIndex + 1)

    // 最初の列から順に確認し、すべて null の列があればそこにイベントを追加
    for (let col = 0; ; col++) {
      if (
        targetRows.every((row) => {
          while (col >= row.events.length) {
            row.events.push(null) // 列が足りない場合は null を追加
          }
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
    // 全体の列数を計算（全行の最大列数）
    const totalColumns = Math.max(...this.rows.map((row) => row.events.length), 0)

    const durationEvents: DurationEventPos[] = []
    const momentEvents: MomentEventPos[] = []
    const prosessedEvents = new Set<CampEvent>()

    for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
      const row = this.rows[rowIndex]

      // 各行の各列を確認
      for (let colIndex = 0; colIndex < row.events.length; colIndex++) {
        const event = row.events[colIndex]

        if (event && !prosessedEvents.has(event)) {
          prosessedEvents.add(event)

          if (event.type === 'moment') {
            momentEvents.push({ row: rowIndex, event: event })
          } else {
            // 期間イベントの場合、開始行と終了行を特定
            const startRowIndex = this._getStampIndex(getStartTime(event)) + 1
            const endRowIndex = this._getStampIndex(getEndTime(event)) - 1

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

    // 単一の EventGroup として返す
    return [
      {
        columns: totalColumns,
        rows: this.rows,
        durationEvents,
        momentEvents,
      },
    ]
  }
}
