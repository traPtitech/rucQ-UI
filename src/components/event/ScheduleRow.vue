<script setup lang="ts">
import type { GridRow } from '@/lib/event-grid'
import { getTimeStringNoPad } from '@/lib/date'
import { computed } from 'vue'

const props = defineProps<{
  row: GridRow
  index: number
}>()

// 左端のタイムスタンプのスタイル
const stampStyle = computed(() => {
  const baseStyle = {
    gridColumn: 1,
    gridRow: props.index + 1,
    minHeight: `${props.row.minHeight === 'narrow' ? 12 : 24}px`,
  }

  switch (props.row.stampAlign) {
    case 'none': // タイムスタンプを表示しない
      return { ...baseStyle, display: 'flex', visibility: 'hidden' as const }
    case 'start': // タイムスタンプを行の先頭に表示
      return { ...baseStyle, display: 'flex', alignItems: 'flex-start' }
    default: // タイムスタンプを行の中央に表示
      return { ...baseStyle, display: 'flex', alignItems: 'center' }
  }
})

// 瞬間イベントのタイトルのスタイル
const momentStyle = computed(() => ({ gridRow: props.index + 1, gridColumn: 2 }))

// 瞬間イベントがない行に引かれる点線のスタイル
const lineStyle = computed(() => ({ gridRow: props.index + 1, gridColumn: '2 / -1' }))
</script>

<template>
  <div :style="stampStyle">
    <div class="w-100 h-0 d-flex justify-center align-center">
      <h5 :class="$style.timeStamp">{{ getTimeStringNoPad(row.time) }}</h5>
    </div>
  </div>
  <div
    v-if="row.events[0]?.type === 'moment'"
    class="w-100 h-100 d-flex justify-start align-center"
    :style="momentStyle"
  >
    <h4 :event="row.events[0]" :class="$style.momentText">
      {{ row.events[0].name }}
    </h4>
  </div>
  <div v-else-if="row.stampAlign !== 'none'" :style="lineStyle">
    <div :class="$style.line"></div>
  </div>
</template>

<style module>
.timeStamp {
  margin-top: 1px;
  font-weight: 900;
  width: fit-content;
  font-family: Roboto;
}

.line {
  width: 100%;
  height: 0px;
  margin-top: -0.5px;
  border-bottom: 1px dashed rgb(var(--v-theme-line));
}

.momentText {
  font-weight: 500;
  padding-left: 4px;
  font-size: 13px;
  cursor: pointer;
}

.momentText:hover {
  text-decoration: underline;
}
</style>
