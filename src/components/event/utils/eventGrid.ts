import type { components } from '@/api/schema'
import { getStartTime, getEndTime } from '@/components/event/utils/eventLib'

type MomentEvent = components['schemas']['MomentEventResponse']
type DurationEvent = components['schemas']['DurationEventResponse']
type OfficialEvent = components['schemas']['OfficialEventResponse']
type CampEvent = MomentEvent | DurationEvent | OfficialEvent

export type GridRow = {
  time: Date
  events: (CampEvent | null)[]
  minHeight: 'narrow' | 'wide'
  stampAlign: 'none' | 'start' | 'center'
}

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
      .map((time) => ({
        time: new Date(time),
        events: [],
        minHeight: 'wide',
        stampAlign: 'start',
      }))
  }

  getIndex(time: Date): number {
    return this.rows.findIndex((row) => row.time.getTime() === time.getTime())
  }

  getLastIndex(time: Date): number {
    return this.rows.findLastIndex((row) => row.time.getTime() === time.getTime())
  }

  // レンダリングの見た目を整えるため、適宜空行を追加
  formatRows(durationStartSet: Set<number>, durationEndSet: Set<number>) {
    // タイムスタンプの表示の近接を避けるため、連続する瞬間イベントの終わり目に空の領域を挿入
    for (let i = this.rows.length - 1; i > 0; i--) {
      if (this.rows[i - 1].events.length === 1 && this.rows[i].events.length === 0) {
        this.rows.splice(i, 0, {
          time: new Date(this.rows[i - 1].time),
          events: [],
          minHeight: 'narrow',
          stampAlign: 'none',
        })
      }
    }

    // 隣り合う期間イベントの間に特定条件で空の領域を挿入
    for (let i = this.rows.length - 1; i > 0; i--) {
      // 手前の時刻から新たに期間イベントが始まる || 後ろの時刻でちょうど期間イベントが終わる
      if (this.rows[i - 1].events.length === 1 && this.rows[i].events.length === 1) {
        const prevIsDurationStart = durationStartSet.has(this.rows[i - 1].time.getTime())
        const nextIsDurationEnd = durationEndSet.has(this.rows[i].time.getTime())

        if (prevIsDurationStart || nextIsDurationEnd) {
          this.rows.splice(i, 0, {
            time: new Date(this.rows[i - 1].time), // 手前のタイムスタンプに合わせる
            events: [],
            minHeight: 'narrow',
            stampAlign: 'none',
          })
        }
      }
    }

    // 先頭のタイムスタンプの表示位置を期間イベントに揃えるため、期間イベントなら先頭に空の領域を挿入
    if (this.rows.length > 0 && this.rows[0].events.length === 0) {
      this.rows.unshift({
        time: new Date(0),
        events: [],
        minHeight: 'narrow',
        stampAlign: 'none',
      })
    }
  }

  // グリッド行に瞬間のイベントを追加。必ず addDurationEvent に先駆けて呼ぶ
  addMomentEvent(event: MomentEvent) {
    const row = this.rows[this.getIndex(getStartTime(event))]
    if (row.events.length > 0) {
      throw new Error('MomentEvent を追加する時刻にすでにイベントが存在します')
    }
    row.events.push(event)
    row.stampAlign = 'center'
  }

  // グリッド行に期間のあるイベントを追加
  addDurationEvent(event: DurationEvent | OfficialEvent) {
    const startIndex = this.getLastIndex(getStartTime(event))
    const endIndex = this.getIndex(getEndTime(event))
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
          groups.push(this.exportGroup(currentGroup))
        }
        groups.push(this.exportGroup([row])) // 瞬間イベントの行も新しいグループとして追加
        currentGroup = []
      }
    }

    if (currentGroup.length > 0) {
      groups.push(this.exportGroup(currentGroup))
    }

    return groups
  }

  // ある範囲のグリッド行をエクスポートして EventGroup を生成
  exportGroup(rows: GridRow[]): EventGroup {
    const columns = Math.max(...rows.map((row) => row.events.length))
    const durationEvents: DurationEventPos[] = []
    const momentEvents: MomentEventPos[] = []
    const processedEvents = new Set<CampEvent>()

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex]

      for (let colIndex = 0; colIndex < row.events.length; colIndex++) {
        const event = row.events[colIndex]

        if (event && !processedEvents.has(event)) {
          if (event.type === 'moment') {
            // 瞬間イベントの場合、行を特定
            momentEvents.push({ row: rowIndex, event: event })
          } else {
            // 期間イベントの場合、開始行と終了行を特定
            durationEvents.push({
              column: colIndex,
              startRow: rows.findIndex((r) => r.events[colIndex] === event),
              endRow: rows.findLastIndex((r) => r.events[colIndex] === event) + 1,
              event: event,
            })
          }

          processedEvents.add(event)
        }
      }
    }

    return {
      columns,
      rows,
      durationEvents,
      momentEvents,
    }
  }
}
