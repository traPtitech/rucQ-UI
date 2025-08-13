<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import { getDayStringNoPad } from '@/lib/date'
import EventTimePick from './EventTimePick.vue'
import EventDeleteDialog from './EventDeleteDialog.vue'
import type { components } from '@/api/schema'

type DurationEvent = components['schemas']['DurationEventResponse']
type EventColor = DurationEvent['displayColor']
type Camp = components['schemas']['CampResponse']

// 型から色の配列を定義することはできないため、手動で定義
const colors: EventColor[] = ['orange', 'green', 'red', 'blue', 'purple', 'pink']

const props = defineProps<{ event: DurationEvent | null; camp: Camp }>()

// イベントの設定
const name = defineModel<string>('name')
const location = defineModel<string>('location')
const startTime = defineModel<Date>('start-time')
const endTime = defineModel<Date>('end-time')
const color = defineModel<DurationEvent['displayColor']>('color')

const dayNum = ref(0)

// dayNum が変化したときに、startTime と endTime の日付を更新
watchEffect(() => {
  if (!startTime.value || !endTime.value) return
  const date = new Date(props.camp.dateStart)
  date.setDate(date.getDate() + dayNum.value)

  startTime.value.setFullYear(date.getFullYear())
  startTime.value.setMonth(date.getMonth())
  startTime.value.setDate(date.getDate())

  endTime.value.setFullYear(date.getFullYear())
  endTime.value.setMonth(date.getMonth())
  endTime.value.setDate(date.getDate())
})

const days = computed(() => {
  const date = new Date(props.camp.dateStart)
  const endDate = new Date(props.camp.dateEnd)
  const days: { id: number; name: string }[] = []
  for (let i = 0; date <= endDate; i++) {
    days.push({ id: i, name: `${i + 1}日目 (${getDayStringNoPad(date)})` })
    date.setDate(date.getDate() + 1)
  }
  return days
})

// 開始時刻のバリデーションルール
const startTimeRule = (date: Date | undefined) => {
  if (!date) return '開始時刻は必須です'
  if (endTime.value && date >= endTime.value) return '終了時刻より前に設定してください'
  return true
}

// 終了時刻のバリデーションルール
const endTimeRule = (date: Date | undefined) => {
  if (!date) return '終了時刻は必須です'
  if (startTime.value && date <= startTime.value) return '開始時刻より後に設定してください'
  return true
}
</script>

<template>
  <div class="h-100">
    <v-text-field
      v-model="name"
      :rules="[(v) => v !== '' || 'タイトルは必須です']"
      label="タイトル"
      variant="underlined"
      required
      :class="$style.titleInput"
    ></v-text-field>
    <v-text-field
      v-model="location"
      :rules="[(v) => v !== '' || '場所は必須です']"
      label="場所"
      prepend-inner-icon="mdi-map-marker-outline"
      variant="underlined"
      required
    ></v-text-field>
    <v-select
      v-model="dayNum"
      :items="days"
      item-value="id"
      item-title="name"
      :rules="[(v) => v !== undefined || '開催日は必須です']"
      label="開催日"
      prepend-inner-icon="mdi-calendar-blank"
      variant="underlined"
      required
    ></v-select>
    <div class="d-flex ga-3">
      <event-time-pick :color="color!" label="開始時刻" :time="startTime" :rule="startTimeRule" />
      <event-time-pick :color="color!" label="終了時刻" :time="endTime" :rule="endTimeRule" />
    </div>
    <v-item-group v-model="color" class="d-flex justify-center" width="100%">
      <v-item v-for="(myColor, i) in colors" :key="i">
        <template #default="{}">
          <v-btn
            :variant="color === myColor ? 'elevated' : 'tonal'"
            :icon="`mdi-numeric-${i + 1}`"
            :color="myColor"
            :ripple="false"
            density="comfortable"
            elevation="0"
            class="ma-1"
            @click="color = myColor"
          ></v-btn>
        </template>
      </v-item>
    </v-item-group>
    <div class="mt-2">
      <event-delete-dialog />
    </div>
  </div>
</template>

<style module>
.titleInput :global(input) {
  font-size: 20px !important;
}

.card :global(.v-card-subtitle) {
  opacity: 1 !important;
}
</style>
