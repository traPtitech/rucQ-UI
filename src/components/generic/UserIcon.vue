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
const iconUrl = computed(() => `https://q.trap.jp/api/v3/public/icon/${userId.value}`)
const cursorStyle = computed(() => ({ cursor: props.idTooltip ? 'pointer' : 'default' }))
</script>

<template>
  <div class="rounded-circle overflow-hidden">
    <v-avatar ref="iconRef" :size="size" class="d-block" :style="cursorStyle">
      <v-img :src="iconUrl" :alt="`${userId}のアイコン`" cover :transition="false">
        <template #placeholder>
          <v-skeleton-loader type="image" class="w-100 h-100" />
        </template>
        <template #error>
          <v-skeleton-loader type="image" class="w-100 h-100" />
        </template>
      </v-img>
    </v-avatar>

    <v-tooltip
      v-if="idTooltip"
      :activator="iconRef"
      open-on-hover
      open-on-click
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
