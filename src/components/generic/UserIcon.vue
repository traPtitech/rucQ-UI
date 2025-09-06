<script setup lang="ts">
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
import { computed, ref, useAttrs } from 'vue'

const { user } = storeToRefs(useUserStore())
const props = defineProps<{ id?: string; size?: number; idTooltip?: boolean }>()
// idTooltip ... クリック時に Tooltip で ID を表示するかどうか

const attrs = useAttrs()

const showTooltip = ref(false)
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
</script>

<template>
  <img
    ref="iconRef"
    tabindex="0"
    v-bind="attrs"
    :style="imageStyle"
    :src="`https://q.trap.jp/api/v3/public/icon/${userId}`"
    @click="showTooltip = !showTooltip"
    @onMouseleave="showTooltip = false"
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
