<script setup lang="ts">
import { computed } from 'vue'
import { getTimeStringNoPad } from '@/utils/date'

// prettier-ignore
const activityTypes = {
  'room_created'            : { color: 'pink', pale: undefined, icon: 'mdi-view-grid' },
  'payment_created'         : { color: 'green', pale: undefined, icon: 'mdi-currency-jpy' },
  'payment_amount_changed'  : { color: 'green', pale: undefined, icon: 'mdi-currency-jpy' },
  'payment_paid_changed'    : { color: 'green', pale: undefined, icon: 'mdi-currency-jpy' },
  'roll_call_created'       : { color: 'primary', pale: 'primaryLight', icon: 'mdi-hand-back-left-outline' },
  'question_created'        : { color: 'blue', pale: 'blue-lighten-4', icon: 'mdi-format-list-checks' },
} as const

const props = withDefaults(
  defineProps<{
    type: keyof typeof activityTypes
    active?: boolean
    date: Date
  }>(),
  { active: true },
)

const color = computed(() => {
  const pale = activityTypes[props.type].pale
  if (!pale) return activityTypes[props.type].color
  return props.active ? activityTypes[props.type].color : pale
})

const surface = computed(() => {
  return props.active ? 'white' : activityTypes[props.type].color
})

const icon = computed(() => activityTypes[props.type].icon)
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
        <slot :color="activityTypes[props.type].color" />
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
