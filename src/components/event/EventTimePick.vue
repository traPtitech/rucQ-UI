<script setup lang="ts">
import type { components } from '@/api/schema'
import { ref, watchEffect } from 'vue'
import { VTimePicker } from 'vuetify/labs/VTimePicker'

type DurationEvent = components['schemas']['DurationEventResponse']
type EventColor = DurationEvent['displayColor']

defineProps<{
  color: EventColor
  label: string
  rule: (date: Date | undefined) => true | string
}>()
const time = defineModel<Date>('time')

const timePick = ref('') // 時刻選択用文字列。12:30 のような形式

watchEffect(() => {
  if (!time.value) return
  const [h, m] = timePick.value.split(':').map(Number)
  time.value.setHours(h, m, 0, 0)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDialogProps = (props: Record<string, any>) => {
  return {
    ...props,
    onmousedown: (e: MouseEvent) => {
      e.preventDefault() // v-text-field への入力信号を防いでラベルが動かないようにする
    },
  }
}
</script>

<template>
  <v-dialog ref="dialog" persistent :v-model:prop-name="timePick">
    <template #activator="{ props: activatorProps }">
      <v-text-field
        v-model="timePick"
        :label="label"
        prepend-inner-icon="mdi-clock-time-four-outline"
        variant="underlined"
        readonly
        v-bind="getDialogProps(activatorProps)"
        required
        :rules="[() => rule(time)]"
      ></v-text-field>
    </template>
    <template #default="{ isActive }">
      <v-sheet width="fit-content" class="mx-auto">
        <v-time-picker v-model="timePick" :title="`${label}を設定`" format="24hr" :color="color" />
        <v-btn
          elevation="0"
          rounded="0"
          width="100%"
          size="large"
          :color="color"
          @click="isActive.value = false"
        >
          <span class="font-weight-bold">OK</span>
        </v-btn>
      </v-sheet>
    </template>
  </v-dialog>
</template>
