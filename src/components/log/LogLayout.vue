<script setup lang="ts">
import { computed } from 'vue'

// prettier-ignore
const logTypes = {
  'transfer-confirmed': { color: 'green', icon: 'mdi-currency-jpy' },
  'room-reveal'       : { color: 'pink', icon: 'mdi-view-grid' },
  'rollcall'          : { color: 'orange', icon: 'mdi-hand-back-left-outline' },
  'question'          : { color: 'blue', icon: 'mdi-format-list-checks' },
} as const

const props = defineProps<{
  type: keyof typeof logTypes
}>()

const color = computed(() => logTypes[props.type].color)
const icon = computed(() => logTypes[props.type].icon)
</script>

<template>
  <v-card color="white" elevation="0" :class="$style.card">
    <div class="h-100 d-flex align-stretch" :class="$style.inCard">
      <div
        class="d-flex flex-column align-center justify-center flex-shrink-0"
        :class="[$style.meta, `bg-${color}`]"
      >
        <span :class="$style.time">{{ '12:34' }}</span>
        <v-icon size="24" :icon="icon" color="white" />
      </div>
      <div
        :class="[
          `px-3 py-1 flex-grow-1 text-${color} d-flex align-center font-weight-medium`,
          $style.content,
        ]"
      >
        <slot />
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
  letter-spacing: 0.1em;
  margin-right: -0.1em;
}

.content {
  line-height: 1.4;
}
</style>
