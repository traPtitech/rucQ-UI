<script setup lang="ts">
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, ref, useAttrs } from 'vue'

const { user } = storeToRefs(useUserStore())
const props = defineProps<{ id?: string; size?: number; idTooltip?: boolean }>()
// idTooltip ... クリック時に Tooltip で ID を表示するかどうか

const TOOLTIP_HOVER_DELAY = 1000 // ホバーから Tooltip 表示までの遅延時間（ミリ秒）

const attrs = useAttrs()

const showTooltip = ref(false)
const hoverTimer = ref<number | null>(null)
const iconRef = ref<HTMLElement | undefined>()

const imageStyle = computed(
  () =>
    ({
      width: `${props.size}px`,
      height: `${props.size}px`,
      objectFit: 'contain',
      borderRadius: `${props.size || 0}px`,
      display: 'block',
      cursor: props.idTooltip ? 'pointer' : 'default',
    }) as const,
)

const userId = computed(() => props.id || user.value?.id)
const tooltipText = computed(() => `@${userId.value}`)

const clearHoverTimer = () => {
  if (hoverTimer.value !== null) {
    window.clearTimeout(hoverTimer.value)
    hoverTimer.value = null
  }
}

const onMouseEnter = () => {
  if (!props.idTooltip) return
  clearHoverTimer()
  // 1 秒間マウスのカーソルをかざし続けたら Tooltip を表示
  hoverTimer.value = window.setTimeout(() => {
    showTooltip.value = true
  }, TOOLTIP_HOVER_DELAY)
}

const onMouseLeave = () => {
  clearHoverTimer()
  showTooltip.value = false
}

const onClick = () => {
  clearHoverTimer()
  showTooltip.value = !showTooltip.value
}

onBeforeUnmount(() => {
  clearHoverTimer()
})
</script>

<template>
  <img
    ref="iconRef"
    tabindex="0"
    v-bind="attrs"
    :style="imageStyle"
    :src="`https://q.trap.jp/api/v3/public/icon/${userId}`"
    @click="onClick"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  />
  <v-tooltip
    v-if="idTooltip"
    v-model="showTooltip"
    :activator="iconRef"
    :open-on-hover="false"
    location="top"
  >
    <span class="text-white font-weight-medium">{{ tooltipText }}</span>
  </v-tooltip>
</template>

<style module>
:global(.v-tooltip .v-overlay__content) {
  background-color: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
</style>
