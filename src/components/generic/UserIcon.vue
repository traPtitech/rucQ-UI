<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '@/store'

const props = defineProps<{
  id?: string
  size: number
  /** クリック時に Tooltip で ID を表示 */
  idTooltip?: boolean
}>()

const iconRef = ref<HTMLElement | undefined>()

const userId = computed(() => props.id ?? useUserStore().user.id)
const iconUrl = computed(
  () => `https://image-proxy.trap.jp/icon/${userId.value}?width=${props.size * 2}`,
  // 2 倍サイズの画像をリクエスト
)
const cursorStyle = computed(() => ({ cursor: props.idTooltip ? 'pointer' : 'default' }))

// 画像のロード状態を管理
const isLoading = ref(true)
const hasError = ref(false)
const showSkeleton = computed(() => isLoading.value || hasError.value)

const handleLoad = () => {
  isLoading.value = false
}

const handleError = () => {
  isLoading.value = false
  hasError.value = true
}
</script>

<template>
  <div class="rounded-circle overflow-hidden">
    <v-avatar ref="iconRef" :size="size" class="d-block" :style="cursorStyle">
      <v-skeleton-loader v-if="showSkeleton" type="image" class="w-100 h-100" />
      <img
        v-show="!showSkeleton"
        class="w-100 h-100"
        tabindex="0"
        :src="iconUrl"
        @load="handleLoad"
        @error="handleError"
      />
    </v-avatar>
    <v-tooltip
      :activator="iconRef"
      :open-on-hover="idTooltip"
      :open-on-click="idTooltip"
      :open-delay="1000"
      location="top"
    >
      <span class="text-white font-weight-medium">{{ `@${userId}` }}</span>
    </v-tooltip>
  </div>
</template>

<style module>
:global(.v-tooltip .v-overlay__content) {
  background-color: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
</style>
