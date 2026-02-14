<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/store'

const props = defineProps<{
  id?: string
  size: number
  /** クリック時に Tooltip で ID を表示 */
  idTooltip?: boolean
}>()

const iconRef = ref<HTMLElement | undefined>()

const userId = computed(() => props.id ?? useUserStore().user.id)
const iconUrl = computed(() => `https://q.trap.jp/api/v3/public/icon/${userId.value}`)
const cursorStyle = computed(() => ({ cursor: props.idTooltip ? 'pointer' : 'default' }))

// 画像のロード状態を管理
const isLoading = ref(true)
const hasError = ref(false)
const showSkeleton = computed(() => isLoading.value || hasError.value)

// userId が変更されたときに状態をリセット
watch(userId, () => {
  isLoading.value = true
  hasError.value = false
})

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
      v-if="idTooltip"
      :activator="iconRef"
      :open-on-hover="true"
      :open-on-click="true"
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
