<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { iconKeys } from '@/api/queries/keys'
import { useUserStore } from '@/store'

const props = defineProps<{ id?: string; size: number; idTooltip?: boolean }>()
// idTooltip ... クリック時に Tooltip で ID を表示するかどうか
const userId = props.id ?? useUserStore().user.id // id が指定されていない場合は自分のアイコンを表示

const $attrs = useAttrs() // $attrs を取得

const showTooltip = ref(false)

const imageStyle = {
  width: `${props.size}px`,
  height: `${props.size}px`,
  objectFit: 'contain' as const,
  borderRadius: `${props.size || 0}px`,
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
  queryKey: iconKeys.user(userId),
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

// tooltipProps から onMouseenter イベントを除外（onMouseleave イベントは維持）
const getModifiedTooltipProps = (tooltipProps: Record<string, unknown>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onMouseenter, ...rest } = tooltipProps // ホバーでは表示させない
  return rest
}
</script>

<template>
  <!-- ロード中はスケルトンを表示 -->
  <template v-if="showSkeleton">
    <v-avatar :size="size">
      <v-skeleton-loader type="image" class="w-100 h-100" />
    </v-avatar>
  </template>

  <template v-else>
    <!-- Tooltipあり版 -->
    <v-tooltip v-if="idTooltip" v-model="showTooltip" location="top">
      <template #default>
        <span class="text-white font-weight-medium">{{ tooltipText }}</span>
      </template>
      <template #activator="{ props: tooltipProps }">
        <v-avatar :size="size" v-bind="{ ...$attrs, ...getModifiedTooltipProps(tooltipProps) }">
          <img
            tabindex="0"
            :style="imageStyle"
            loading="lazy"
            :src="cachedIconUrl"
            @click="showTooltip = !showTooltip"
          />
        </v-avatar>
      </template>
    </v-tooltip>

    <!-- Tooltipなし版 -->
    <v-avatar v-else :size="size" v-bind="$attrs">
      <img :style="imageStyle" loading="lazy" :src="cachedIconUrl" />
    </v-avatar>
  </template>
</template>

<style module>
:global(.v-tooltip .v-overlay__content) {
  background-color: rgba(var(--v-theme-primary), 0.9) !important;
}
</style>
