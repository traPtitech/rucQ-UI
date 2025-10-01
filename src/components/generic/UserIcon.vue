<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { qk } from '@/api/queries/keys'
import { useUserStore } from '@/store'

const props = defineProps<{ id?: string; size: number; idTooltip?: boolean }>()
// idTooltip ... クリック時に Tooltip で ID を表示するかどうか
const userId = props.id ?? useUserStore().user.id // id が指定されていない場合は自分のアイコンを表示

const attrs = useAttrs()
const iconRef = ref<HTMLElement | undefined>()

const imageStyle = {
  width: `${props.size}px`,
  height: `${props.size}px`,
  objectFit: 'contain' as const,
  borderRadius: '50%',
  display: 'block',
  cursor: props.idTooltip ? 'pointer' : 'default',
}

const directUrl = `https://q.trap.jp/api/v3/public/icon/${userId}`

const {
  data: cachedIconUrl,
  isLoading,
  isFetching,
  isError,
} = useQuery<string, Error>({
  queryKey: qk.icons.user(userId),
  staleTime: 24 * 60 * 60_000, // 24h
  gcTime: 24 * 60 * 60_000, // 24h
  retry: 0,
  // データURLで保存する
  queryFn: async () => {
    const res = await fetch(directUrl)
    if (!res.ok) throw new Error(`アイコンを取得できませんでした: ${res.status}`)

    const blob = await res.blob()
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('アイコンの変換に失敗しました'))
      reader.readAsDataURL(blob)
    })
    return dataUrl
  },
})

const showSkeleton = computed(
  () => !cachedIconUrl.value || isLoading.value || isFetching.value || isError.value,
)

const tooltipText = `@${userId}`
</script>
<template>
  <template v-if="showSkeleton">
    <v-avatar :size="size">
      <v-skeleton-loader type="image" class="w-100 h-100" />
    </v-avatar>
  </template>

  <template v-else>
    <img
      ref="iconRef"
      tabindex="0"
      v-bind="attrs"
      :style="imageStyle"
      :src="cachedIconUrl"
      loading="lazy"
    />

    <v-tooltip
      :activator="iconRef"
      :open-on-hover="idTooltip"
      :open-on-click="idTooltip"
      :open-delay="1000"
      location="top"
    >
      <span class="text-white font-weight-medium">{{ tooltipText }}</span>
    </v-tooltip>
  </template>
</template>

<style module>
:global(.v-tooltip .v-overlay__content) {
  background-color: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
</style>
