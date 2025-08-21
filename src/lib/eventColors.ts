// イベントで利用可能な色の定義
import type { components } from '@/api/schema'

type DurationEvent = components['schemas']['DurationEventResponse']

// 型から色の配列を定義することはできないため、手動で定義
export const EVENT_COLORS: DurationEvent['displayColor'][] = [
  'orange',
  'green',
  'red',
  'blue',
  'purple',
  'pink',
]
