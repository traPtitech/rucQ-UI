<script setup lang="ts">
import { computed } from 'vue'
import { getDayStringNoPad } from '@/lib/date'
import { getLayout } from '@/lib/event-layout'
import EventBlock from '@/components/event/EventBlock.vue'
import type { components } from '@/api/schema'
import type { EventGroup, DurationEventPos } from '@/lib/event-grid'
import ScheduleRow from './ScheduleRow.vue'

type CampEvent = components['schemas']['EventResponse']
type Camp = components['schemas']['CampResponse']

const props = defineProps<{
  events: CampEvent[]
  camp: Camp
}>()

const daysWithEventGroups = computed(() => {
  return getLayout(props.events, props.camp)
})

// イベントグループ（時間的重なりを持つイベントのまとまり）のスタイル
const eventGroupStyle = (eventGroup: EventGroup) => ({
  display: 'grid',
  gridTemplateColumns: `42px repeat(${Math.max(eventGroup.columns, 1)}, 1fr)`,
  // 42px はタイムスタンプ用の固定列幅
})

// 単一のイベントブロックのスタイル
const eventBlockStyle = (event: DurationEventPos) => ({
  gridRow: `${event.startRow + 1} / ${event.endRow + 1}`,
  gridColumn: event.column + 2, // 1-indexed かつ 1 列目はタイムスタンプ用なので +2
})
</script>

<template>
  <div :class="$style.container">
    <div v-for="(day, i) in daysWithEventGroups" :key="i">
      <h2 :class="$style.dayTitle">
        {{ `Day ${i + 1} - ${getDayStringNoPad(day.date)}` }}
      </h2>
      <div v-for="(group, j) in day.eventGroups" :key="j" :style="eventGroupStyle(group)">
        <schedule-row v-for="(row, k) in group.rows" :key="k" :row="row" :index="k" />
        <event-block
          v-for="(durationEvent, k) in group.durationEvents"
          :key="k"
          :event="durationEvent.event"
          :style="eventBlockStyle(durationEvent)"
        />
      </div>
    </div>
  </div>
</template>

<style module>
.container {
  height: 100%;
  overflow: hidden;
  width: 100%;
  margin: auto;
  position: relative;
}

.dayTitle {
  margin: 20px 0 10px 0;
  font-weight: 900;
}
</style>
