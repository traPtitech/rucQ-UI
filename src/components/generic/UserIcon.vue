<script setup lang="ts">
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const { user } = storeToRefs(useUserStore())
const props = defineProps<{ id?: string; size?: number; idTooltip?: boolean }>()
// idTooltip ... クリック時に Tooltip で ID を表示するかどうか

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

const handleClick = () => {
  if (props.idTooltip) {
    showTooltip.value = true
  }
}

// tooltipProps からマウスイベントを除外
const getModifiedTooltipProps = (tooltipProps: Record<string, unknown>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onMouseenter, ...rest } = tooltipProps
  return rest
}
</script>

<template>
  <v-tooltip v-if="idTooltip" v-model="showTooltip" :text="tooltipText" location="top">
    <template #activator="{ props: tooltipProps }">
      <img
        :style="imageStyle"
        :src="`https://q.trap.jp/api/v3/public/icon/${userId}`"
        v-bind="getModifiedTooltipProps(tooltipProps)"
        @click="handleClick"
      />
    </template>
  </v-tooltip>
  <img v-else :style="imageStyle" :src="`https://q.trap.jp/api/v3/public/icon/${userId}`" />
</template>
