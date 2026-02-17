<script setup lang="ts">
import { computed } from 'vue'
import { getTimeStringNoPad } from '@/utils/date'

// prettier-ignore
const logTypes = {
  'transfer-confirm': { color: 'green', pale: undefined, icon: 'mdi-currency-jpy' },
  'room-reveal'     : { color: 'pink', pale: undefined, icon: 'mdi-view-grid' },
  'rollcall'        : { color: 'primary', pale: 'primaryLight', icon: 'mdi-hand-back-left-outline' },
  'question'        : { color: 'blue', pale: 'blue-lighten-4', icon: 'mdi-format-list-checks' },
} as const

const props = withDefaults(
  defineProps<{
    type: keyof typeof logTypes
    active?: boolean
    date: Date
  }>(),
  { active: true },
)

const color = computed(() => {
  const pale = logTypes[props.type].pale
  if (!pale) return logTypes[props.type].color
  return props.active ? logTypes[props.type].color : pale
})

const surface = computed(() => {
  return props.active ? 'white' : logTypes[props.type].color
})

const icon = computed(() => logTypes[props.type].icon)
</script>

<template>
  <v-card elevation="0" :class="$style.card">
    <div class="h-100 d-flex align-stretch" :class="$style.inCard">
      <div
        class="d-flex flex-column align-center justify-center flex-shrink-0"
        :class="[$style.meta, `bg-${color} text-${surface}`]"
      >
        <span :class="$style.time">{{ getTimeStringNoPad(date) }}</span>
        <v-icon size="24" :icon="icon" />
      </div>
      <div
        :class="[`px-3 py-1 flex-grow-1 d-flex align-center font-weight-medium`, $style.content]"
      >
        <slot :color="logTypes[props.type].color" />
      </div>
    </div>
  </v-card>
</template>

<style module>
.card {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
}

.inCard {
  min-height: 60px;
}

.meta {
  width: 40px;
}

.time {
  font-size: 10px;
  font-family: 'Reddit Sans Variable', sans-serif;
  font-weight: 900;
  letter-spacing: 0.075em;
  margin-right: -0.075em;
}

.content {
  line-height: 1.4;
}
</style>
