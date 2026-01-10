<script setup lang="ts">
import type { components } from '@/api/schema'
import { nextTick, ref, watch, onMounted } from 'vue'
import type { VTextField } from 'vuetify/components'

type DurationEvent = components['schemas']['DurationEventResponse']
type EventColor = DurationEvent['displayColor']

const textFieldRef = ref<VTextField>()

defineProps<{
  color: EventColor
  label: string
  rule: (minute: number | undefined) => true | string
}>()

const minute = defineModel<number | undefined>('minute')
const timePick = ref('') // Vuetify 時刻選択用文字列。12:30 のような形式
const dummyTime = '25:00' // Vuetify 時刻選択でのダミー値。実際には使用しない

// timePick の値の更新を検知して minute を更新
watch(
  () => timePick.value,
  () => {
    if (!timePick.value) return
    if (timePick.value === dummyTime) return
    const [h, m] = timePick.value.split(':').map(Number)
    minute.value = h * 60 + m
  },
)

// timePick の初期値を minute から設定
const setTimePick = () => {
  if (minute.value === undefined) return
  const h = Math.floor(minute.value / 60)
  const m = minute.value % 60
  timePick.value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

watch(() => minute.value, setTimePick)
onMounted(setTimePick)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDialogProps = (props: Record<string, any>) => {
  return { ...props, onmousedown: (e: MouseEvent) => e.preventDefault() }
  // v-text-field への入力信号を防いでラベルが動かないようにする
}

// バリデーションを行う関数
const validate = () => {
  if (!timePick.value) return
  const temp = timePick.value
  timePick.value = dummyTime // 一時的に値を変化させてバリデーションを起動
  void nextTick(() => (timePick.value = temp))
}

defineExpose({ validate })
</script>

<template>
  <v-dialog ref="dialog" persistent :v-model:prop-name="timePick">
    <template #activator="{ props: activatorProps }">
      <v-text-field
        ref="textFieldRef"
        v-model="timePick"
        :label="label"
        prepend-inner-icon="mdi-clock-time-four-outline"
        variant="underlined"
        readonly
        v-bind="getDialogProps(activatorProps)"
        :rules="[() => rule(minute)]"
        :class="$style.textField"
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

<style module>
.textField :global(input),
.textField :global(.v-field) {
  cursor: pointer;
}
</style>
