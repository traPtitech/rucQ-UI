<script setup lang="ts">
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
import { computed, ref, useAttrs } from 'vue'

const { user } = storeToRefs(useUserStore())
const props = defineProps<{ id?: string; size?: number; idTooltip?: boolean }>()
// idTooltip ... クリック時に Tooltip で ID を表示するかどうか

const $attrs = useAttrs() // $attrs を取得

const showTooltip = ref(false)

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

// tooltipProps から onMouseenter イベントを除外（onMouseleave イベントは維持）
const getModifiedTooltipProps = (tooltipProps: Record<string, unknown>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onMouseenter, ...rest } = tooltipProps // ホバーでは表示させない
  return rest
}
</script>

<template>
  <v-tooltip v-if="idTooltip" v-model="showTooltip" location="top">
    <template #default>
      <span class="text-white font-weight-medium">{{ tooltipText }}</span>
    </template>
    <template #activator="{ props: tooltipProps }">
      <img
        v-bind="{ ...$attrs, ...getModifiedTooltipProps(tooltipProps) }"
        :style="imageStyle"
        :src="`https://q.trap.jp/api/v3/public/icon/${userId}`"
        @click="showTooltip = !showTooltip"
      />
    </template>
  </v-tooltip>
  <img
    v-else
    v-bind="$attrs"
    :style="imageStyle"
    :src="`https://q.trap.jp/api/v3/public/icon/${userId}`"
  />
</template>

<style module>
:global(.v-tooltip .v-overlay__content) {
  background-color: rgba(var(--v-theme-primary), 0.9) !important;
}
</style>
