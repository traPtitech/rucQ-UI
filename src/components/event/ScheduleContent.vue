<script setup lang="ts">
import { computed, ref } from 'vue'
import { getDayStringNoPad } from '@/utils/date'
import { getLayout } from '@/components/event/utils/eventLayout'
import EventBlock from '@/components/event/EventBlock.vue'
import type { components } from '@/api/schema'
import type { EventGroup, DurationEventPos } from '@/components/event/utils/eventGrid'
import EventEditor from './EventEditor.vue'
import ScheduleRow from './ScheduleRow.vue'

type CampEvent = components['schemas']['EventResponse']
type DurationEvent = components['schemas']['DurationEventResponse']
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

const focusEvent = ref<DurationEvent | null>(null)
const inEditMode = ref<boolean>(false)

const enterEditMode = (event: CampEvent) => {
  if (event.type !== 'duration') return
  inEditMode.value = true
  focusEvent.value = event
}
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
          v-for="durationEvent in group.durationEvents"
          :key="durationEvent.event.id"
          :event="durationEvent.event"
          :style="eventBlockStyle(durationEvent)"
          @edit="() => enterEditMode(durationEvent.event)"
        />
      </div>
    </div>
  </div>
  <v-dialog
    v-model="inEditMode"
    fullscreen
    transition="dialog-bottom-transition"
    @after-leave="focusEvent = null"
  >
    <event-editor :event="focusEvent" @close="inEditMode = false" />
  </v-dialog>
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
  font-size: 22px;
  margin: 20px 0 10px 0;
  font-weight: 900;
}
</style>
